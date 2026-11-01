import Link from 'next/link';

const taglines = ['Plan it.', 'Run it.', 'Judge it.'];

const stages = [
  ['01', 'Register', 'Participants sign up and form teams in minutes.'],
  ['02', 'Submit', 'One project per team, with repository and demo links.'],
  ['03', 'Review', 'Organizers approve or send back work with clear feedback.'],
  ['04', 'Judge', 'Judges score on five criteria and see only approved projects.'],
  ['05', 'Announce', 'A live leaderboard shows results the moment scoring ends.'],
];

const benefits = [
  ['Every event, one workspace', 'Teams, submissions, reviews and scores live in one place, not across forms and spreadsheets.'],
  ['No more dead demo links', 'Every link is checked automatically, so judges open working projects and teams find problems before the deadline.'],
  ['Fair, transparent results', 'Consistent scoring criteria and a live leaderboard that everyone can trust.'],
  ['Built for every role', 'Participants, organizers and judges each get a focused view of what they need.'],
];

const preview = [
  ['Inventory Optimizer', 'Team Alpha', 'Approved', 'Live', 'Live'],
  ['Campus Connect', 'Team Orbit', 'Pending', 'Live', 'Needs fix'],
  ['HealthTrack', 'Team Delta', 'Pending', 'Live', 'Checking'],
];

const chip = (s: string) =>
  s === 'Live'
    ? 'bg-green-100 text-green-800'
    : s === 'Needs fix'
    ? 'bg-red-100 text-red-800'
    : 'bg-gray-100 text-gray-600';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-900 text-white text-xs font-mono font-bold flex items-center justify-center rounded-sm">
              M
            </span>
            <span className="font-semibold tracking-tight">ManageMate</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#how" className="hover:text-gray-900">How it works</a>
            <a href="#why" className="hover:text-gray-900">Why ManageMate</a>
            <Link
              href="/auth"
              className="bg-gray-900 text-white rounded-sm px-4 py-1.5 font-medium hover:bg-gray-700"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-20 grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-blue-700">
                End-to-end event management
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight leading-tight">
                From registration to results, all in one place.
              </h1>
              <p className="mt-4 text-gray-600 max-w-lg leading-relaxed">
                ManageMate runs your hackathon or project event from start to
                finish, so organizers spend their time on the event, not on
                chasing links, forms and scores.
              </p>
              <div className="mt-6 flex gap-3 font-mono text-sm text-gray-500">
                {taglines.map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link
                  href="/auth"
                  className="bg-gray-900 text-white rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-gray-700"
                >
                  Get started
                </Link>
                <a
                  href="#how"
                  className="border border-gray-300 rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-white"
                >
                  See how it works
                </a>
              </div>
            </div>

            <div className="border border-gray-300 rounded-sm bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-100">
                <span className="text-xs font-medium text-gray-700">Organizer view</span>
                <span className="font-mono text-xs text-gray-500">3 submissions</span>
              </div>
              <table className="w-full text-xs">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Project</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                    <th className="px-2 py-2 font-medium">Repo</th>
                    <th className="px-2 py-2 font-medium">Demo</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map(([title, team, status, repo, demo]) => (
                    <tr key={title} className="border-t border-gray-200">
                      <td className="px-4 py-2.5">
                        <div className="font-medium">{title}</div>
                        <div className="text-gray-500">{team}</div>
                      </td>
                      <td className="px-2 py-2.5">{status}</td>
                      <td className="px-2 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded-sm ${chip(repo)}`}>{repo}</span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded-sm ${chip(demo)}`}>{demo}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="how" className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <p className="font-mono text-xs uppercase tracking-widest text-blue-700">How it works</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              The whole event, in five steps
            </h2>
            <div className="mt-8 grid gap-px bg-gray-200 border border-gray-200 sm:grid-cols-2 lg:grid-cols-5">
              {stages.map(([n, title, text]) => (
                <div key={n} className="bg-white p-5">
                  <span className="font-mono text-xs text-gray-400">{n}</span>
                  <h3 className="mt-2 font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <p className="font-mono text-xs uppercase tracking-widest text-blue-700">Why ManageMate</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Less chasing. More event.
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {benefits.map(([title, text]) => (
                <div key={title} className="border-l-2 border-gray-900 pl-4">
                  <h3 className="font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Ready to run your next event?
              </h2>
              <p className="mt-1 text-gray-600 text-sm">
                Create an account and be set up in minutes.
              </p>
            </div>
            <Link
              href="/auth"
              className="bg-gray-900 text-white rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-gray-700 w-fit"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between text-xs text-gray-500">
          <span>ManageMate. Plan it. Run it. Judge it.</span>
          <span className="font-mono">v0.1.0</span>
        </div>
      </footer>
    </div>
  );
}