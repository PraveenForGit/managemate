'use client';

import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans selection:bg-brand-500 selection:text-white overflow-hidden relative">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20">
            M
          </div>
          <span className="text-xl font-bold tracking-tight">
            Manage<span className="text-brand-500">Mate</span>
          </span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">
          Build Faster.<br /> Manage Better.
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one platform to host hackathons, form teams, and submit projects.
          Focus on the code, we will handle the chaos.
        </p>

        <Link
          href="/auth"
          className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold border-2 border-white text-lg hover:bg-blue-800 transition shadow-xl shadow-brand-600/20"
        >
          Get Started
        </Link>
      </main>

      <footer className="relative z-10 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 Managemate. Built for Management.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
