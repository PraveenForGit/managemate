'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Profile = { id: string; name: string; role: string };
type Project = {
  id: string;
  title: string;
  problem: string;
  github_url: string;
  demo_url: string | null;
  description: string;
  teams: { name: string } | null;
};
type Score = {
  id: string;
  submission_id: string;
  innovation: number;
  uiux: number;
  impact: number;
  technical: number;
  completion: number;
  total: number;
  comments: string | null;
};
type Row = {
  submission_id: string;
  title: string;
  team_name: string;
  avg_score: number;
  judge_count: number;
};

const CRITERIA = ['innovation', 'uiux', 'impact', 'technical', 'completion'] as const;
type Criterion = (typeof CRITERIA)[number];
const LABELS: Record<Criterion, string> = {
  innovation: 'Innovation',
  uiux: 'UI / UX',
  impact: 'Impact',
  technical: 'Technical',
  completion: 'Completion',
};

const input =
  'w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-900';

const emptyForm: Record<Criterion, string> & { comments: string } = {
  innovation: '', uiux: '', impact: '', technical: '', completion: '', comments: '',
};

export default function JudgeDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [myScores, setMyScores] = useState<Score[]>([]);
  const [leaderboard, setLeaderboard] = useState<Row[]>([]);
  const [tab, setTab] = useState<'projects' | 'leaderboard'>('projects');
  const [selected, setSelected] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAll(userId: string) {
    const { data: p } = await supabase
      .from('submissions')
      .select('id, title, problem, github_url, demo_url, description, teams(name)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    setProjects((p ?? []) as unknown as Project[]);

    const { data: s } = await supabase
      .from('scores')
      .select('*')
      .eq('judge_id', userId);
    setMyScores((s ?? []) as Score[]);

    const { data: lb } = await supabase.from('leaderboard').select('*');
    setLeaderboard((lb ?? []) as Row[]);
  }

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/auth'); return; }

      const { data: p } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();
      if (!p || p.role !== 'judge') { router.replace('/auth'); return; }

      setProfile(p);
      await loadAll(user.id);
      setLoading(false);
    })();
  }, [router]);

  function scoreFor(projectId: string) {
    return myScores.find(s => s.submission_id === projectId);
  }

  function openScoring(project: Project) {
    const existing = scoreFor(project.id);
    setSelected(project);
    setError('');
    setForm(
      existing
        ? {
            innovation: String(existing.innovation),
            uiux: String(existing.uiux),
            impact: String(existing.impact),
            technical: String(existing.technical),
            completion: String(existing.completion),
            comments: existing.comments ?? '',
          }
        : emptyForm
    );
  }

  async function submitScore(e: FormEvent) {
    e.preventDefault();
    if (!selected || !profile) return;
    setError('');

    const { error: err } = await supabase.from('scores').upsert(
      {
        submission_id: selected.id,
        judge_id: profile.id,
        innovation: Number(form.innovation),
        uiux: Number(form.uiux),
        impact: Number(form.impact),
        technical: Number(form.technical),
        completion: Number(form.completion),
        comments: form.comments || null,
      },
      { onConflict: 'submission_id,judge_id' }
    );
    if (err) { setError(err.message); return; }

    setSelected(null);
    await loadAll(profile.id);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-semibold">ManageMate</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">{profile?.name} (judge)</span>
            <button onClick={logout} className="underline">Log out</button>
          </div>
        </div>
        <nav className="max-w-4xl mx-auto px-4 flex gap-6 text-sm">
          {(['projects', 'leaderboard'] as const).map(t => (
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

      <main className="max-w-4xl mx-auto p-4">
        {tab === 'projects' && (
          <section className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Project</th>
                  <th className="p-3">Team</th>
                  <th className="p-3">Your score</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-gray-500">No approved projects yet.</td></tr>
                )}
                {projects.map(p => {
                  const s = scoreFor(p.id);
                  return (
                    <tr key={p.id} className="border-t border-gray-200">
                      <td className="p-3">{p.title}</td>
                      <td className="p-3">{p.teams?.name ?? '-'}</td>
                      <td className="p-3">{s ? `${s.total} / 100` : 'Not scored'}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => openScoring(p)} className="underline">
                          {s ? 'Edit score' : 'Score'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
          <form
            onSubmit={submitScore}
            className="bg-white rounded-lg border border-gray-200 w-full max-w-lg p-5 space-y-3 text-sm max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-semibold text-lg">{selected.title}</h2>
            <p><strong>Problem:</strong> {selected.problem}</p>
            <p className="whitespace-pre-wrap text-gray-700">{selected.description}</p>
            <p>
              <a href={selected.github_url} target="_blank" rel="noreferrer" className="underline">GitHub</a>
              {selected.demo_url && (
                <> · <a href={selected.demo_url} target="_blank" rel="noreferrer" className="underline">Demo</a></>
              )}
            </p>

            <hr className="border-gray-200" />

            {CRITERIA.map(c => (
              <div key={c} className="flex items-center justify-between gap-4">
                <label htmlFor={c}>{LABELS[c]} (0-20)</label>
                <input
                  id={c}
                  type="number"
                  min={0}
                  max={20}
                  required
                  value={form[c]}
                  onChange={e => setForm({ ...form, [c]: e.target.value })}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-center text-gray-900 bg-white"
                />
              </div>
            ))}

            <textarea
              className={input}
              rows={3}
              placeholder="Feedback (optional)"
              value={form.comments}
              onChange={e => setForm({ ...form, comments: e.target.value })}
            />

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button className="bg-gray-900 text-white rounded px-4 py-2 font-medium hover:bg-gray-700">
                Save score
              </button>
              <button type="button" onClick={() => setSelected(null)} className="px-4 py-2 underline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}