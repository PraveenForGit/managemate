import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Submission, Team, User } from '@/types';

interface SubmissionTabProps {
  currentTeam: Team | null;
  currentSubmission: Submission | null;
  submissionData: {
    projectTitle: string;
    problemStatement: string;
    githubLink: string;
    deploymentLink: string;
    demoVideo: string;
    readme: string;
    buildLogs: string;
  };
  onSubmissionChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmissionSubmit: (e: FormEvent) => void;
  userExists: boolean;
}

export function SubmissionTab({
  currentTeam,
  currentSubmission,
  submissionData,
  onSubmissionChange,
  onSubmissionSubmit,
  userExists
}: SubmissionTabProps) {
  if (!currentTeam) {
    return <p className="text-yellow-400 font-semibold">Please create or join a team first.</p>;
  }

  if (currentSubmission) {
    return (
      <div>
        <div className={`submission-status ${currentSubmission.status} px-3 py-1 mb-3 rounded inline-block font-semibold ${
            currentSubmission.status === 'pending' ? 'bg-yellow-500 text-black' :
            currentSubmission.status === 'approved' ? 'bg-green-600 text-white' :
            'bg-red-600 text-white'
          }`}>
          Status: {currentSubmission.status.toUpperCase()}
        </div>
        <h3 className="text-xl font-bold mb-2">{currentSubmission.projectTitle}</h3>
        <p><strong>Problem Statement:</strong> {currentSubmission.problemStatement}</p>
        <div className="project-links flex gap-4 my-3 flex-wrap">
          <a href={currentSubmission.githubLink} target="_blank" rel="noreferrer" className="project-link">🔗 GitHub</a>
          {currentSubmission.deploymentLink && <a href={currentSubmission.deploymentLink} target="_blank" rel="noreferrer" className="project-link">🚀 Deployment</a>}
          {currentSubmission.demoVideo && <a href={currentSubmission.demoVideo} target="_blank" rel="noreferrer" className="project-link">📹 Demo Video</a>}
        </div>
        <div className="mb-3">
          <h4 className="font-semibold">Project Description:</h4>
          <p className="whitespace-pre-wrap text-slate-400">{currentSubmission.readme}</p>
        </div>
        {currentSubmission.buildLogs && (
          <div className="mb-3">
            <h4 className="font-semibold">Build Logs:</h4>
            <p className="whitespace-pre-wrap text-slate-400">{currentSubmission.buildLogs}</p>
          </div>
        )}
        {currentSubmission.adminComments && (
          <div className="mb-3 p-3 bg-slate-700 rounded">
            <h4 className="font-semibold">Admin Comments:</h4>
            <p className="text-slate-400">{currentSubmission.adminComments}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmissionSubmit} className="space-y-4 max-w-lg">
      <div>
        <label htmlFor="projectTitle" className="block font-semibold mb-1">Project Title</label>
        <input
          id="projectTitle"
          type="text"
          required
          value={submissionData.projectTitle}
          onChange={onSubmissionChange}
          className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="problemStatement" className="block font-semibold mb-1">Problem Statement</label>
        <textarea
          id="problemStatement"
          required
          rows={3}
          placeholder="Describe the problem your project solves..."
          value={submissionData.problemStatement}
          onChange={onSubmissionChange}
          className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="githubLink" className="block font-semibold mb-1">GitHub Repository Link</label>
        <input
          id="githubLink"
          type="url"
          required
          placeholder="https://github.com/username/repo"
          value={submissionData.githubLink}
          onChange={onSubmissionChange}
          className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="deploymentLink" className="block font-semibold mb-1">Deployment Link</label>
        <input
          id="deploymentLink"
          type="url"
          placeholder="https://your-app.com"
          value={submissionData.deploymentLink}
          onChange={onSubmissionChange}
          className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="demoVideo" className="block font-semibold mb-1">Demo Video Link (YouTube/Vimeo)</label>
        <input
          id="demoVideo"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={submissionData.demoVideo}
          onChange={onSubmissionChange}
          className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="readme" className="block font-semibold mb-1">Project Description (README style)</label>
        <textarea
          id="readme"
          rows={6}
          required
          placeholder="Describe your project, features, tech stack, etc..."
          value={submissionData.readme}
          onChange={onSubmissionChange}
          className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="buildLogs" className="block font-semibold mb-1">Build Logs / Progress Updates</label>
        <textarea
          id="buildLogs"
          placeholder="Document your development progress, challenges faced, solutions implemented..."
          value={submissionData.buildLogs}
          onChange={onSubmissionChange}
          className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
        />
      </div>
      <button type="submit" className="btn-primary px-6 py-2 rounded font-bold text-white">Submit Project</button>
    </form>
  );
}
