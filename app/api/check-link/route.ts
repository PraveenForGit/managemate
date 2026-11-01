import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import dns from 'node:dns/promises';
import net from 'node:net';

type LinkStatus = 'ok' | 'unverified' | 'broken';

function isPrivate(ip: string) {
  if (net.isIPv6(ip)) {
    return (
      ip === '::1' || ip.startsWith('::ffff:') ||
      ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80')
    );
  }
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

async function check(url: string): Promise<LinkStatus> {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return 'broken';

    const addrs = await dns.lookup(u.hostname, { all: true });
    if (addrs.some(a => isPrivate(a.address))) return 'broken';

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: ctrl.signal,
      headers: { 'user-agent': 'ManageMateLinkCheck/1.0' },
    });
    clearTimeout(timer);
    res.body?.cancel();

    if (res.status < 400) return 'ok';
    if ([401, 403, 429].includes(res.status)) return 'unverified';
    return 'broken';
  } catch {
    return 'broken';
  }
}

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const { submissionId } = await req.json();
  if (!token || !submissionId) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: sub } = await db
    .from('submissions')
    .select('github_url, demo_url')
    .eq('id', submissionId)
    .single();
  if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [github_status, demo_status] = await Promise.all([
    check(sub.github_url),
    sub.demo_url ? check(sub.demo_url) : Promise.resolve(null),
  ]);

  const { error } = await db.rpc('record_link_check', {
    p_submission: submissionId,
    p_github: github_status,
    p_demo: demo_status,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 403 });

  return NextResponse.json({ github_status, demo_status });
}