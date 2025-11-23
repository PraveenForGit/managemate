import React from 'react';
import { SubmissionAdmin } from '@/types';

interface ReviewModalProps {
  submission: SubmissionAdmin;  // Use SubmissionAdmin here
  adminComments: string;
  setAdminComments: (comments: string) => void;
  onClose: () => void;
  onUpdateStatus: (status: 'approved' | 'rejected') => void;
}

export function ReviewModal({
  submission,
  adminComments,
  setAdminComments,
  onClose,
  onUpdateStatus
}: ReviewModalProps) {
  return (
    <div className="modal fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="modal-content bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <button className="modal-close absolute top-3 right-3 text-slate-400 hover:text-white text-2xl font-bold" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-semibold mb-4">Review Submission</h2>
        <h3 className="text-xl font-bold mb-2">{submission.projectTitle}</h3>
        <p className="mb-1"><strong>Problem Statement:</strong> {submission.problemStatement}</p>
        <div className="flex gap-3 my-3 flex-wrap">
          <a href={submission.githubLink} target="_blank" rel="noreferrer" className="project-link">🔗 GitHub</a>
          {submission.deploymentLink && <a href={submission.deploymentLink} target="_blank" rel="noreferrer" className="project-link">🚀 Deployment</a>}
          {submission.demoVideo && <a href={submission.demoVideo} target="_blank" rel="noreferrer" className="project-link">📹 Demo Video</a>}
        </div>
        <div className="mb-3">
          <h4 className="font-semibold">Project Description:</h4>
          <p className="whitespace-pre-wrap text-slate-400">{submission.readme}</p>
        </div>
        {submission.buildLogs && (
          <div className="mb-3">
            <h4 className="font-semibold">Build Logs:</h4>
            <p className="whitespace-pre-wrap text-slate-400">{submission.buildLogs}</p>
          </div>
        )}
        {submission.adminComments && (
          <div className="mb-3 p-3 bg-slate-700 rounded">
            <h4 className="font-semibold">Previous Comments:</h4>
            <p className="text-slate-400">{submission.adminComments}</p>
          </div>
        )}
        <label htmlFor="adminComments" className="block font-semibold mb-1">Comments</label>
        <textarea
          id="adminComments"
          rows={3}
          value={adminComments}
          onChange={e => setAdminComments(e.target.value)}
          className="w-full p-2 rounded border border-slate-600 bg-slate-900 text-slate-100 mb-4"
        />
        <div className="flex gap-3">
          <button className="btn-success bg-green-600 px-4 py-2 rounded font-semibold hover:bg-green-700" onClick={() => onUpdateStatus('approved')}>Approve</button>
          <button className="btn-danger bg-red-600 px-4 py-2 rounded font-semibold hover:bg-red-700" onClick={() => onUpdateStatus('rejected')}>Reject</button>
          <button className="btn-secondary bg-gray-600 px-4 py-2 rounded font-semibold hover:bg-gray-700" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
