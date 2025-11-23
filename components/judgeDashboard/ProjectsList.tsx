import React from 'react';
import { Submission, Team, Score, User } from '@/types';

interface ProjectsListProps {
  submissions: Submission[];
  teams: Team[];
  scores: Score[];
  currentUserId: string;
  sortFilter: 'all' | 'scored' | 'unscored';
  onEvaluateClick: (submission: Submission) => void;
}

export function ProjectsList({ submissions, teams, scores, currentUserId, sortFilter, onEvaluateClick }: ProjectsListProps) {
  // Filter according to sortFilter
  let filteredSubs = submissions;
  if (sortFilter === 'scored') {
    filteredSubs = submissions.filter(s => scores.some(score => score.submissionId === s.id && score.judgeId === currentUserId));
  } else if (sortFilter === 'unscored') {
    filteredSubs = submissions.filter(s => !scores.some(score => score.submissionId === s.id && score.judgeId === currentUserId));
  }

  if (filteredSubs.length === 0) {
    return <p className="text-center text-slate-500">No approved projects available</p>;
  }

  return (
    <>
      {filteredSubs.map(submission => {
        const team = teams.find(t => t.id === submission.teamId);
        const existingScore = scores.find(score => score.submissionId === submission.id && score.judgeId === currentUserId);
        const allScores = scores.filter(score => score.submissionId === submission.id);

        return (
          <div key={submission.id} className="project-card bg-slate-700 border border-slate-600 rounded-md p-6 mb-4 hover:border-indigo-500 transition">
            <div className="project-header flex justify-between items-start mb-2">
              <div>
                <div className="project-title text-xl font-bold">{submission.projectTitle}</div>
                <div className="project-team text-slate-400">{team ? team.name : 'Unknown Team'}</div>
              </div>
              {existingScore ? (
                <span className="badge badge-success bg-green-600 text-white px-3 py-1 rounded text-xs uppercase font-bold">
                  Scored: {existingScore.total}/100
                </span>
              ) : (
                <span className="badge badge-warning bg-yellow-400 text-black px-3 py-1 rounded text-xs uppercase font-bold">
                  Pending
                </span>
              )}
            </div>
            <p className="mb-4 text-slate-400">{submission.problemStatement.substring(0, 150)}...</p>
            {allScores.length > 0 && (
              <div className="score-display flex gap-6 mb-4 flex-wrap">
                <div className="score-item flex flex-col items-center min-w-[120px] p-3 bg-slate-800 rounded border border-slate-600 text-center">
                  <div className="score-label text-xs text-slate-400 uppercase font-semibold mb-1">Avg Score</div>
                  <div className="score-total text-lg font-extrabold text-indigo-400">
                    {(allScores.reduce((sum, s) => sum + s.total, 0) / allScores.length).toFixed(1)}
                  </div>
                </div>
                <div className="score-item flex flex-col items-center min-w-[120px] p-3 bg-slate-800 rounded border border-slate-600 text-center">
                  <div className="score-label text-xs text-slate-400 uppercase font-semibold mb-1">Judges</div>
                  <div className="score-value text-indigo-400 text-lg font-bold">{allScores.length}</div>
                </div>
              </div>
            )}
            <div className="action-buttons flex gap-3">
              <button className="btn-primary btn-sm px-4 py-2 rounded" onClick={() => onEvaluateClick(submission)}>
                {existingScore ? 'Update Score' : 'Evaluate Project'}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
