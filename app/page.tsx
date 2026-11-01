import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-semibold">ManageMate</span>
          <Link href="/auth" className="text-sm underline">Log in</Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        <h1 className="text-3xl font-semibold max-w-xl">
          Run hackathon submissions and judging in one place.
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl">
          Teams submit projects, admins review them, and judges score approved
          work. The leaderboard updates as scores come in.
        </p>
        <Link
          href="/auth"
          className="inline-block mt-6 bg-gray-900 text-white rounded px-5 py-2 text-sm font-medium hover:bg-gray-700"
        >
          Get started
        </Link>

        <div className="mt-14 grid gap-4 sm:grid-cols-3 text-sm">
          {[
            ['Participants', 'Create a team and submit one project.'],
            ['Admins', 'Review submissions, approve or reject with comments.'],
            ['Judges', 'Score approved projects on five criteria out of 100.'],
          ].map(([title, text]) => (
            <div key={title} className="bg-white border border-gray-200 rounded p-4">
              <h2 className="font-medium">{title}</h2>
              <p className="mt-1 text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}