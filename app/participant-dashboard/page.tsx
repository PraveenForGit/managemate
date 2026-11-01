'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Profile = { id: string; name: string; role: string };
type Team = { id: string; name: string };
type MemberRow = { profiles: { name: string } | null };
type Submission = {
  id: string;
  title: string;
  problem: string;
  github_url: string;
  demo_url: string | null;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_comment: string | null;
};
type Row = {
  submission_id: string;
  title: string;
  team_name: string;
  avg_score: number;
  judge_count: number;
};

const input =
  'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900';
const button =
  'bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50';

export default function ParticipantDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [leaderboard, setLeaderboard] = useState<Row[]>([]);
  const [tab, setTab] = useState<'team' | 'submission' | 'leaderboard'>('team');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [teamName, setTeamName] = useState('');
  const [form, setForm] = useState({
    title: '', problem: '', github_url: '', demo_url: '', description: '',
  });

  async function loadAll(userId: string) {
    const { data: tm } = await supabase
      .from('team_members')
      .select('team_id, teams(id, name)')
      .eq('user_id', userId)
      .maybeSingle();

    const t = (tm?.teams as unknown as Team | null) ?? null;
    setTeam(t);

    if (t) {
      const { data: mem } = await supabase
        .from('team_members')
        .select('profiles(name)')
        .eq('team_id', t.id);
      const rows = (mem ?? []) as unknown as MemberRow[];
      setMembers(rows.map(m => m.profiles?.name || 'Unnamed'));

      const { data: sub } = await supabase
        .from('submissions')
        .select('*')
        .eq('team_id', t.id)
        .maybeSingle();
      setSubmission(sub as Submission | null);
    }

    const { data: lb } = await supabase.from('leaderboard').select('*');
    setLeaderboard((lb ?? []) as Row[]);
  }

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/auth'); return; }

      const { data: p } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();
      if (!p || p.role !== 'participant') { router.replace('/auth'); return; }

      setProfile(p);
      await loadAll(user.id);
      setLoading(false);
    })();
  }, [router]);

  async function createTeam(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setError('');

    const { data: t, error: e1 } = await supabase
      .from('teams')
      .insert({ name: teamName, created_by: profile.id })
      .select()
      .single();
    if (e1) { setError(e1.message); return; }

    const { error: e2 } = await supabase
      .from('team_members')
      .insert({ team_id: t.id, user_id: profile.id });
    if (e2) { setError(e2.message); return; }

    setTeamName('');
    await loadAll(profile.id);
  }

  async function submitProject(e: FormEvent) {
    e.preventDefault();
    if (!profile || !team) return;
    setError('');

    const { error: err } = await supabase.from('submissions').insert({
      team_id: team.id,
      title: form.title,
      problem: form.problem,
      github_url: form.github_url,
      demo_url: form.demo_url || null,
      description: form.description,
    });
    if (err) { setError(err.message); return; }
    await loadAll(profile.id);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  const statusStyle = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-semibold">ManageMate</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">{profile?.name} (participant)</span>
            <button onClick={logout} className="underline">Log out</button>
          </div>
        </div>
        <nav className="max-w-4xl mx-auto px-4 flex gap-6 text-sm">
          {(['team', 'submission', 'leaderboard'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`py-2 capitalize ${
                tab === t
                  ? 'border-b-2 border-gray-900 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        {tab === 'team' && (
          <section className="bg-white border border-gray-200 rounded p-5">
            {team ? (
              <>
                <h2 className="font-semibold text-lg mb-2">{team.name}</h2>
                <p className="text-sm text-gray-600 mb-1">Members</p>
                <ul className="list-disc list-inside text-sm">
                  {members.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </>
            ) : (
              <form onSubmit={createTeam} className="space-y-3 max-w-sm">
                <h2 className="font-semibold text-lg">Create a team</h2>
                <input className={input} placeholder="Team name" required
                  value={teamName} onChange={e => setTeamName(e.target.value)} />
                <button className={button}>Create team</button>
              </form>
            )}
          </section>
        )}

        {tab === 'submission' && (
          <section className="bg-white border border-gray-200 rounded p-5">
            {!team ? (
              <p className="text-sm text-gray-600">Create a team first.</p>
            ) : submission ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-lg">{submission.title}</h2>
                  <span className={`px-2 py-0.5 rounded text-xs ${statusStyle[submission.status]}`}>
                    {submission.status}
                  </span>
                </div>
                <p><strong>Problem:</strong> {submission.problem}</p>
                <p className="whitespace-pre-wrap">{submission.description}</p>
                <p>
                  <a href={submission.github_url} target="_blank" rel="noreferrer" className="underline">GitHub</a>
                  {submission.demo_url && (
                    <> · <a href={submission.demo_url} target="_blank" rel="noreferrer" className="underline">Demo</a></>
                  )}
                </p>
                {submission.admin_comment && (
                  <p className="bg-gray-100 rounded p-3">
                    <strong>Admin comment:</strong> {submission.admin_comment}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={submitProject} className="space-y-3 max-w-lg">
                <h2 className="font-semibold text-lg">Submit your project</h2>
                <input className={input} placeholder="Project title" required
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <textarea className={input} rows={3} placeholder="Problem statement" required
                  value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} />
                <input className={input} type="url" placeholder="GitHub URL" required
                  value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
                <input className={input} type="url" placeholder="Demo URL (optional)"
                  value={form.demo_url} onChange={e => setForm({ ...form, demo_url: e.target.value })} />
                <textarea className={input} rows={5} placeholder="Description" required
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <button className={button}>Submit</button>
              </form>
            )}
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
                  <tr><td colSpan={5} className="p-4 text-gray-500">No scored projects yet.</td></tr>
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
    </div>
  );
}