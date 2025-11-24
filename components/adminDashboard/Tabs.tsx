type Tab = 'submissions' | 'judges' | 'timeline' | 'leaderboard';

interface TabsProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export function Tabs({ activeTab, onChange }: TabsProps) {
  const tabs: Tab[] = ['submissions', 'judges', 'timeline', 'leaderboard'];

  return (
    <nav className="tabs flex border-b border-slate-700 bg-slate-800">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-3 text-center font-semibold transition ${
            activeTab === tab
              ? 'border-b-4 border-indigo-500 text-indigo-400 bg-slate-700'
              : 'text-slate-400 hover:bg-slate-700'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  );
}
