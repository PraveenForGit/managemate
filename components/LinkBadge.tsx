import type { LinkStatus } from '@/lib/checkLinks';

const styles = {
  ok: 'bg-green-100 text-green-800',
  unverified: 'bg-yellow-100 text-yellow-800',
  broken: 'bg-red-100 text-red-800',
};
const labels = {
  ok: 'Reachable',
  unverified: 'Could not verify',
  broken: 'Not reachable',
};

export function LinkBadge({ status }: { status: LinkStatus | null }) {
  if (!status) {
    return <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">Not checked</span>;
  }
  return <span className={`px-2 py-0.5 rounded text-xs ${styles[status]}`}>{labels[status]}</span>;
}