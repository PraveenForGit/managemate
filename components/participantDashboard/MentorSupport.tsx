import React, { FormEvent, ChangeEvent } from 'react';
import { MentorRequest } from '@/types';

interface MentorSupportProps {
  currentTeamExists: boolean;
  mentorRequests: MentorRequest[];
  mentorData: { category: string; description: string };
  onMentorChange: (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => void;
  onMentorSubmit: (e: FormEvent) => void;
}

export function MentorSupport({
  currentTeamExists,
  mentorRequests,
  mentorData,
  onMentorChange,
  onMentorSubmit
}: MentorSupportProps) {
  if (!currentTeamExists) {
    return <p className="text-yellow-400 font-semibold">Please create or join a team first.</p>;
  }

  return (
    <>
      <form onSubmit={onMentorSubmit} className="space-y-4 max-w-lg mb-6">
        <div>
          <label htmlFor="mentorCategory" className="block font-semibold mb-1">Support Category</label>
          <select
            id="mentorCategory"
            value={mentorData.category}
            onChange={onMentorChange}
            required
            className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
          >
            <option value="">Select Category</option>
            <option value="technical">Technical Help</option>
            <option value="design">UI/UX Design</option>
            <option value="architecture">Architecture</option>
            <option value="deployment">Deployment</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="mentorDescription" className="block font-semibold mb-1">Describe your issue</label>
          <textarea
            id="mentorDescription"
            rows={5}
            required
            placeholder="Explain what help you need..."
            value={mentorData.description}
            onChange={onMentorChange}
            className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
          />
        </div>
        <button type="submit" className="btn-primary px-6 py-2 rounded font-bold text-white">Request Support</button>
      </form>
      <div>
        <h3 className="text-xl font-semibold mb-3">Your Support Requests</h3>
        {mentorRequests.length === 0 ? (
          <p className="text-slate-400">No support requests yet</p>
        ) : (
          mentorRequests.map(r => (
            <div key={r.id} className="mentor-request bg-slate-700 rounded p-4 mb-3">
              <div className="mentor-request-header flex justify-between items-center mb-2">
                <span className="mentor-category bg-indigo-600 text-white px-2 py-1 rounded text-xs uppercase font-semibold">{r.category}</span>
                <span className={`badge ${
                  r.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-green-600 text-white'
                } px-2 py-1 rounded text-xs uppercase font-semibold`}>
                  {r.status}
                </span>
              </div>
              <p className="text-slate-300 mb-1">{r.description}</p>
              <small className="text-slate-400">{new Date(r.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </>
  );
}
