import { LeaderboardItem } from '@/types';

interface LeaderboardProps {
  leaderboard: LeaderboardItem[];
}

export function Leaderboard({ leaderboard }: LeaderboardProps) {
  if (leaderboard.length === 0) {
    return <p className="text-slate-400 text-center">No projects on leaderboard yet</p>;
  }
  return (
    <>
      {leaderboard.map((item, idx) => {
        const rank = idx + 1;
        const rankClass =
          rank === 1 ? 'text-yellow-400' :
          rank === 2 ? 'text-gray-400' :
          rank === 3 ? 'text-amber-600' : 'text-white';

        return (
          <div key={item.submission.id} className="leaderboard-item bg-slate-700 rounded border border-slate-600 p-4 mb-3 flex items-center gap-4 hover:bg-slate-600 transition">
            <div className={`leaderboard-rank text-3xl font-bold w-16 text-center ${rankClass}`}>#{rank}</div>
            <div className="leaderboard-content flex-1">
              <h3 className="leaderboard-title text-lg font-semibold">{item.submission.projectTitle}</h3>
              <p className="leaderboard-team text-sm text-slate-400">{item.team?.name || 'Unknown Team'} • {item.judgeCount} judge{item.judgeCount !== 1 ? 's' : ''}</p>
            </div>
            <div className="leaderboard-score text-green-400 text-2xl font-extrabold">{item.averageScore.toFixed(1)}</div>
          </div>
        );
      })}
    </>
  );
}
