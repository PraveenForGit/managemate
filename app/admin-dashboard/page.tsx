'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Profile = { id: string; name: string; role: string };
type SubmissionRow = {
  id: string;
  title: string;
  problem: string;
  github_url: string;
  demo_url: string | null;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_comment: string | null;
  created_at: string;
  teams: { name: string } | null;
};
type Row = {
  submission_id: string;
  title: string;
  team_name: string;
  avg_score: number;
  judge_count: number;
};
type JudgeRow = { id: string; name: string };

const statusStyle = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const input =
  'w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-900';

export default function AdminDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subs, setSubs] = useState<SubmissionRow[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [judges, setJudges] = useState<JudgeRow[]>([]);
  const [leaderboard, setLeaderboard] = useState<Row[]>([]);
  const [tab, setTab] = useState<'submissions' | 'judges' | 'leaderboard'>('submissions');
  const [selected, setSelected] = useState<SubmissionRow | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAll() {
    const { data: s } = await supabase
      .from('submissions')
      .select('*, teams(name)')
      .order('created_at', { ascending: false });
    setSubs((s ?? []) as unknown as SubmissionRow[]);

    const { data: j } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('role', 'judge');
    setJudges((j ?? []) as JudgeRow[]);

    const { data: lb } = await supabase.from('leaderboard').select('*');
    setLeaderboard((lb ?? []) as Row[]);
  }

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/auth'); return; }

      const { data: p } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();
      if (!p || p.role !== 'admin') { router.replace('/auth'); return; }

      setProfile(p);
      await loadAll();
      setLoading(false);
    })();
  }, [router]);

  function openReview(s: SubmissionRow) {
    setSelected(s);
    setComment(s.admin_comment ?? '');
    setError('');
  }

  async function decide(status: 'approved' | 'rejected') {
    if (!selected) return;
    const { error: err } = await supabase
      .from('submissions')
      .update({ status, admin_comment: comment || null })
      .eq('id', selected.id);
    if (err) { setError(err.message); return; }
    setSelected(null);
    await loadAll();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  const visible = filter === 'all' ? subs : subs.filter(s => s.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-semibold">ManageMate</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">{profile?.name} (admin)</span>
            <button onClick={logout} className="underline">Log out</button>
          </div>
        </div>
        <nav className="max-w-4xl mx-auto px-4 flex gap-6 text-sm">
          {(['submissions', 'judges', 'leaderboard'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 capitalize ${
                tab === t ? 'border-b-2 border-gray-900 font-medium' : 'text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {tab === 'submissions' && (
          <section className="bg-white border border-gray-200 rounded overflow-hidden">
            <div className="p-3 border-b border-gray-200 flex items-center gap-2 text-sm">
              <label htmlFor="filter">Status</label>
              <select
                id="filter"
                value={filter}
                onChange={e => setFilter(e.target.value as typeof filter)}
                className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-900"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Project</th>
                  <th className="p-3">Team</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-gray-500">No submissions.</td></tr>
                )}
                {visible.map(s => (
                  <tr key={s.id} className="border-t border-gray-200">
                    <td className="p-3">{s.title}</td>
                    <td className="p-3">{s.teams?.name ?? '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${statusStyle[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => openReview(s)} className="underline">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === 'judges' && (
          <section className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr><th className="p-3">Judge</th></tr>
              </thead>
              <tbody>
                {judges.length === 0 && (
                  <tr><td className="p-4 text-gray-500">No judges registered yet.</td></tr>
                )}
                {judges.map(j => (
                  <tr key={j.id} className="border-t border-gray-200">
                    <td className="p-3">{j.name || 'Unnamed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === 'leaderboard' && (
          <section className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 w-12">#</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Team</th>
                  <th className="p-3 text-right">Score</th>
                  <th className="p-3 text-right">Judges</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-gray-500">No approved projects yet.</td></tr>
                )}
                {leaderboard.map((r, i) => (
                  <tr key={r.submission_id} className="border-t border-gray-200">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{r.title}</td>
                    <td className="p-3">{r.team_name}</td>
                    <td className="p-3 text-right">{r.avg_score}</td>
                    <td className="p-3 text-right">{r.judge_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg border border-gray-200 w-full max-w-lg p-5 space-y-3 text-sm max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-semibold text-lg">{selected.title}</h2>
            <p><strong>Team:</strong> {selected.teams?.name ?? '-'}</p>
            <p><strong>Problem:</strong> {selected.problem}</p>
            <p className="whitespace-pre-wrap">{selected.description}</p>
            <p>
              <a href={selected.github_url} target="_blank" rel="noreferrer" className="underline">GitHub</a>
              {selected.demo_url && (
                <> · <a href={selected.demo_url} target="_blank" rel="noreferrer" className="underline">Demo</a></>
              )}
            </p>
            <textarea
              className={input}
              rows={3}
              placeholder="Comment for the team (optional)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            {error && <p className="text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => decide('approved')}
                className="bg-gray-900 text-white rounded px-4 py-2 font-medium hover:bg-gray-700"
              >
                Approve
              </button>
              <button
                onClick={() => decide('rejected')}
                className="border border-gray-300 rounded px-4 py-2 font-medium hover:bg-gray-100"
              >
                Reject
              </button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 underline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}