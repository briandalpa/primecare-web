import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ActionType, BypassRequest } from '@/types/bypassRequest';

interface Props {
  data: BypassRequest[];
  onAction: (id: string, type: ActionType) => void;
  isLoadingAction: boolean;
}

const formatMismatchSummary = (item: BypassRequest) => {
  if (!item.mismatchItems.length) return '-';

  return item.mismatchItems
    .map((mismatch) => (
      `${mismatch.itemName}: ${mismatch.expectedQuantity} -> ${mismatch.submittedQuantity}`
    ))
    .join(', ');
};

export default function BypassRequestTable({
  data,
  onAction,
  isLoadingAction,
}: Props) {
  if (data.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No pending bypass requests
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Worker</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Mismatch</TableHead>
            <TableHead>Worker Notes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-xs">
                {item.orderId || '-'}
              </TableCell>
              <TableCell>{item.workerName || '-'}</TableCell>
              <TableCell>{item.station || '-'}</TableCell>
              <TableCell className="max-w-md whitespace-normal">
                {formatMismatchSummary(item)}
              </TableCell>
              <TableCell className="max-w-xs whitespace-normal">
                {item.problemDescription || '-'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {item.status === 'PENDING' ? 'Pending Review' : item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
