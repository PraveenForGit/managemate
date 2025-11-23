import React, { FormEvent } from 'react';

interface AnnouncementsFormProps {
  onSubmit: (title: string, content: string, date: string) => void;
}

export function AnnouncementsForm({ onSubmit }: AnnouncementsFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('announcementTitle') as HTMLInputElement).value;
    const content = (form.elements.namedItem('announcementContent') as HTMLTextAreaElement).value;
    const date = (form.elements.namedItem('announcementDate') as HTMLInputElement).value;

    onSubmit(title, content, date);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid gap-4 max-w-lg">
      <div>
        <label htmlFor="announcementTitle" className="block font-semibold mb-1">Announcement Title</label>
        <input type="text" id="announcementTitle" name="announcementTitle" required className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-800 text-slate-100" />
      </div>
      <div>
        <label htmlFor="announcementContent" className="block font-semibold mb-1">Content</label>
        <textarea id="announcementContent" name="announcementContent" rows={4} required className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-800 text-slate-100"></textarea>
      </div>
      <div>
        <label htmlFor="announcementDate" className="block font-semibold mb-1">Date & Time</label>
        <input type="datetime-local" id="announcementDate" name="announcementDate" required className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-800 text-slate-100" />
      </div>
      <button type="submit" className="btn-primary w-fit px-6 py-2 rounded font-bold text-white bg-indigo-600 hover:bg-indigo-700">Create Announcement</button>
    </form>
  );
}
