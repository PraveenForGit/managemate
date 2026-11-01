import { supabase } from '@/lib/supabase';

export type LinkStatus = 'ok' | 'unverified' | 'broken';

export async function checkLinks(submissionId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error('checkLinks: no session');
    return null;
  }

  const res = await fetch('/api/check-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ submissionId }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('checkLinks failed', res.status, text.slice(0, 200));
    return null;
  }
  return res.json();
}