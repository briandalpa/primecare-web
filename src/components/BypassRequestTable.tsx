import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BypassRequest } from '@/types/bypassRequest';

type Props = {
  data: BypassRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
};

const statusMap = {
  PENDING: { label: 'Pending Review', variant: 'secondary' },
  APPROVED: { label: 'Approved', variant: 'default' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
} as const;

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
  onApprove,
  onReject,
  isLoading,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Worker</TableHead>
          <TableHead>Station</TableHead>
          <TableHead>Mismatch</TableHead>
          <TableHead>Worker Notes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item) => {
          const status = statusMap[item.status];

          return (
            <TableRow key={item.id}>
              <TableCell>
                {item.orderId || '-'}
              </TableCell>

              <TableCell>
                {item.workerName || '-'}
              </TableCell>

              <TableCell>
                {item.station || '-'}
              </TableCell>

              <TableCell className="max-w-md whitespace-normal">
                {formatMismatchSummary(item)}
              </TableCell>

              <TableCell className="max-w-xs whitespace-normal">
                {item.problemDescription || '-'}
              </TableCell>

              <TableCell>
                <Badge variant={status.variant}>
                  {status.label}
                </Badge>
              </TableCell>

              <TableCell>
                {new Date(item.createdAt).toLocaleString()}
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={isLoading}
                    onClick={() => onApprove(item.id)}
                  >
                    Approve
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isLoading}
                    onClick={() => onReject(item.id)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
