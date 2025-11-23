import React from 'react';
import { User } from '@/types';

interface JudgesListProps {
  judges: User[];
}

export function JudgesList({ judges }: JudgesListProps) {
  if (judges.length === 0) return <p className="text-center text-slate-500">No judges registered yet</p>;

  return (
    <>
      {judges.map(judge => (
        <div key={judge.id} className="project-card bg-slate-800 border border-slate-700 rounded-md p-6 mb-4 hover:border-indigo-500 transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">{judge.name}</p>
              <p className="text-slate-400 text-sm">{judge.email}</p>
            </div>
            <span className="role-badge judge px-3 py-1 bg-yellow-400 text-black rounded uppercase font-bold text-xs">Judge</span>
          </div>
        </div>
      ))}
    </>
  );
}
