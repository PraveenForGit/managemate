import React from 'react';

interface TabToggleProps {
  activeTab: 'login' | 'signup';
  onChange: (tab: 'login' | 'signup') => void;
}

export function TabToggle({ activeTab, onChange }: TabToggleProps) {
  return (
    <div className="flex gap-2 bg-slate-900 rounded-md mb-8 p-1">
      <button
        onClick={() => onChange('login')}
        className={`flex-1 py-2 rounded-md font-semibold transition ${activeTab === 'login' ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'text-slate-400'}`}
      >
        Login
      </button>
      <button
        onClick={() => onChange('signup')}
        className={`flex-1 py-2 rounded-md font-semibold transition ${activeTab === 'signup' ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'text-slate-400'}`}
      >
        Sign Up
      </button>
    </div>
  );
}
