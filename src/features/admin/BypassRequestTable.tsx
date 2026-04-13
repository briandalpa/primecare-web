import { Button } from '@/components/ui/button';
import type { BypassRequest, ActionType } from '@/types/bypassRequest';

interface Props {
  data: BypassRequest[];
  onAction: (id: string, type: ActionType) => void;
  isLoadingAction: boolean;
}

export default function BypassRequestTable({
  data,
  onAction,
  isLoadingAction,
}: Props) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No pending bypass requests
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3">ID</th>
            <th className="pb-3">Worker</th>
            <th className="pb-3">Station</th>
            <th className="pb-3">Problem</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Created At</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-3 text-xs font-mono">{item.id}</td>

              <td className="py-3">
                {item.worker?.name ?? '-'}
              </td>

              <td className="py-3">
                {item.stationRecord?.id ?? '-'}
              </td>

              <td className="py-3">
                {item.problemDescription ?? '—'}
              </td>

              <td className="py-3">
                {item.status === 'PENDING'
                  ? 'Pending Review'
                  : item.status}
              </td>

              <td className="py-3 text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()}
              </td>

              <td className="py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={isLoadingAction}
                    onClick={() => onAction(item.id, 'APPROVE')}
                  >
                    Approve
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isLoadingAction}
                    onClick={() => onAction(item.id, 'REJECT')}
                  >
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}