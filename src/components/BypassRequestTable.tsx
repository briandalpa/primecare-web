import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { BypassRequest } from '@/types/bypassRequest';

type Props = {
  data: BypassRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
};

const statusMap = {
  PENDING: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
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
          <TableHead>Expected Qty</TableHead>
          <TableHead>Submitted Qty</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.stationRecord?.order?.id ?? '-'}</TableCell>
            <TableCell>{item.worker?.name ?? '-'}</TableCell>
            <TableCell>
              {item.stationRecord?.station?.name ?? '-'}
            </TableCell>
            <TableCell>
              {item.stationRecord?.previousQuantity ?? '-'}
            </TableCell>
            <TableCell>
              {item.stationRecord?.submittedQuantity ?? '-'}
            </TableCell>
            <TableCell>{statusMap[item.status]}</TableCell>
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
        ))}
      </TableBody>
    </Table>
  );
}