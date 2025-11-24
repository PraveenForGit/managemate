import { SubmissionAdmin } from '@/types';

interface SubmissionListProps {
  submissions: SubmissionAdmin[];
  onReviewClick: (submission: SubmissionAdmin) => void;
}

export function SubmissionList({ submissions, onReviewClick }: SubmissionListProps) {
  if (submissions.length === 0) {
    return <p className="text-center text-slate-500">No submissions found</p>;
  }

  return (
    <>
      {submissions.map(sub => (
        <div key={sub.id} className="project-card bg-slate-800 border border-slate-700 rounded-md p-6 mb-4 hover:border-indigo-500 transition">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold">{sub.projectTitle}</h3>
              <p className="text-slate-400 text-sm">{sub.problemStatement.substring(0, 150)}...</p>
            </div>
            <span
              className={`badge ${
                sub.status === 'approved' ? 'bg-green-600 text-white' :
                  sub.status === 'rejected' ? 'bg-red-600 text-white' :
                  'bg-yellow-500 text-black'
              } px-3 py-1 rounded uppercase text-xs font-bold`}
            >
              {sub.status}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <button className="btn-primary text-sm px-3 py-1 rounded" onClick={() => onReviewClick(sub)}>
              Review
            </button>
            <small className="text-slate-500">{new Date(sub.createdAt).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </>
  );
}
