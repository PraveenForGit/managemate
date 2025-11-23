import React, { FormEvent } from 'react';
import { Submission } from '@/types';

interface ScoringModalProps {
  submission: Submission;
  formData: {
    innovation: string;
    uiux: string;
    impact: string;
    technical: string;
    completion: string;
    comments: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}

export function ScoringModal({ submission, formData, onFormChange, onSubmit, onClose }: ScoringModalProps) {
  return (
    <div className="modal fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="modal-content bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
        <button className="modal-close absolute top-3 right-3 text-slate-400 hover:text-white text-2xl font-bold" onClick={onClose} aria-label="Close scoring modal">&times;</button>
        <h2 className="text-2xl font-semibold mb-4">Evaluate Project</h2>
        <div id="projectDetails" className="mb-4">
          <h3 className="text-xl font-bold mb-1">{submission.projectTitle}</h3>
          <p className="mb-2"><strong>Problem Statement: </strong>{submission.problemStatement}</p>
          <div className="project-links flex gap-3 mb-4 flex-wrap">
            <a href={submission.githubLink} target="_blank" rel="noreferrer" className="project-link">🔗 GitHub</a>
            {submission.deploymentLink && <a href={submission.deploymentLink} target="_blank" rel="noreferrer" className="project-link">🚀 Deployment</a>}
            {submission.demoVideo && <a href={submission.demoVideo} target="_blank" rel="noreferrer" className="project-link">📹 Demo Video</a>}
          </div>
          {submission.readme && <div><h4 className="font-semibold mb-1">Project Description:</h4><p className="whitespace-pre-wrap text-slate-400">{submission.readme}</p></div>}
          {submission.buildLogs && <div className="mt-4"><h4 className="font-semibold mb-1">Build Logs:</h4><p className="whitespace-pre-wrap text-slate-400">{submission.buildLogs}</p></div>}
          <hr className="my-6 border-slate-600" />
        </div>
        <form id="scoringForm" onSubmit={onSubmit} className="space-y-4">
          {['innovation', 'uiux', 'impact', 'technical', 'completion'].map(field => (
            <div key={field} className="score-input-group flex items-center gap-4">
              <label className="flex-1 font-semibold capitalize">{field.toUpperCase()} (0-20)</label>
              <input
                type="number"
                id={field}
                min={0}
                max={20}
                required
                value={(formData as any)[field]}
                onChange={onFormChange}
                className="w-20 px-2 py-1 rounded border border-slate-600 bg-slate-900 text-slate-100 text-center"
              />
            </div>
          ))}
          <div className="form-group">
            <label htmlFor="comments" className="block mb-1 font-semibold">Comments / Feedback</label>
            <textarea
              id="comments"
              rows={4}
              placeholder="Provide detailed feedback..."
              value={formData.comments}
              onChange={onFormChange}
              className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn-primary px-6 py-2 rounded font-bold text-white">Submit Score</button>
            <button type="button" onClick={onClose} className="btn-secondary bg-gray-600 px-6 py-2 rounded font-semibold hover:bg-gray-700">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
