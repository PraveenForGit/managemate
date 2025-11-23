import React from 'react';
import { Announcement } from '@/types';

interface AnnouncementsListProps {
  announcements: Announcement[];
}

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  if (announcements.length === 0) return <p className="text-center text-slate-500">No announcements yet</p>;

  return (
    <>
      {announcements.map(a => (
        <div key={a.id} className="timeline-item bg-slate-800 border-l-4 border-indigo-500 p-4 rounded mb-4">
          <div className="timeline-date text-sm text-slate-400 mb-1">{new Date(a.date).toLocaleString()}</div>
          <div className="timeline-title font-semibold text-lg">{a.title}</div>
          <div className="timeline-content text-slate-300">{a.content}</div>
        </div>
      ))}
    </>
  );
}
