import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWorkerOrderDetail } from '@/hooks/useWorkerOrderDetail';
import { formatWorkerDateTime, WORKER_COPY } from '@/utils/worker';

type WorkerHistoryDetailDialogProps = {
  open: boolean;
  orderId: string | null;
  onOpenChange: (open: boolean) => void;
};

function WorkerHistoryDetailTable({
  title,
  items,
}: {
  title: string;
  items: Array<{ laundryItemId: string; itemName: string; quantity: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{WORKER_COPY.processOrderItemLabel}</TableHead>
              <TableHead>{WORKER_COPY.processOrderReferenceQuantity}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.laundryItemId}>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function WorkerHistoryDetailDialog({
  open,
  orderId,
  onOpenChange,
}: WorkerHistoryDetailDialogProps) {
  const orderDetail = useWorkerOrderDetail(orderId ?? '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{WORKER_COPY.historyDetailTitle}</DialogTitle>
          <DialogDescription>
            {WORKER_COPY.historyDetailDescription}
          </DialogDescription>
        </DialogHeader>

        {orderDetail.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading detail...</p>
        ) : orderDetail.isError || !orderDetail.data?.data ? (
          <p className="text-sm text-destructive">
            {WORKER_COPY.processOrderLoadError}
          </p>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {WORKER_COPY.processOrderOrderIdLabel}
                  </p>
                  <p className="font-medium">{orderDetail.data.data.orderId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {WORKER_COPY.processOrderStationLabel}
                  </p>
                  <p className="font-medium">{orderDetail.data.data.station}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {WORKER_COPY.processOrderPaymentStatusLabel}
                  </p>
                  <p className="font-medium">{orderDetail.data.data.paymentStatus}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {WORKER_COPY.historyCompletedAtLabel}
                  </p>
                  <p className="font-medium">
                    {formatWorkerDateTime(orderDetail.data.data.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <WorkerHistoryDetailTable
              title={WORKER_COPY.processOrderReferenceTitle}
              items={orderDetail.data.data.referenceItems}
            />
            <WorkerHistoryDetailTable
              title={WORKER_COPY.processOrderFormTitle}
              items={orderDetail.data.data.stationItems}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
