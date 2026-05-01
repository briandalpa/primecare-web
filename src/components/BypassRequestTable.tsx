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
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="space-y-4">
      <div className="space-y-3 md:hidden">
        {data.length === 0 ? (
          <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            No bypass requests found.
          </div>
        ) : (
          data.map((item) => {
            const status = statusMap[item.status];

            return (
              <Card key={item.id} className="rounded-xl shadow-sm">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.orderId || '-'}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.workerName || '-'}</p>
                    </div>

                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <div className="grid gap-3 text-sm">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Station
                      </p>
                      <p className="mt-1">{item.station || '-'}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Mismatch Summary
                      </p>
                      <p className="mt-1 whitespace-normal">{formatMismatchSummary(item)}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Worker Notes
                      </p>
                      <p className="mt-1 whitespace-normal">{item.problemDescription || '-'}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Created
                      </p>
                      <p className="mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button disabled={isLoading} onClick={() => onApprove(item.id)}>
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      disabled={isLoading}
                      onClick={() => onReject(item.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="hidden md:block">
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
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  No bypass requests found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
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
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
