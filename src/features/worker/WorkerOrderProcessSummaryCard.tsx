import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WorkerOrderDetail } from '@/types/worker-order';
import {
  WORKER_COPY,
  formatWorkerDateTime,
  getWorkerStatusLabel,
} from '@/utils/worker';

type WorkerOrderProcessSummaryCardProps = {
  detail: WorkerOrderDetail;
};

export function WorkerOrderProcessSummaryCard({
  detail,
}: WorkerOrderProcessSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{WORKER_COPY.processOrderTitle}</CardTitle>
        <CardDescription>{WORKER_COPY.processOrderDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-4">
        <p>
          {WORKER_COPY.processOrderOrderIdLabel}:{' '}
          <span className="font-medium text-foreground">{detail.orderId}</span>
        </p>
        <p>
          {WORKER_COPY.processOrderStationLabel}:{' '}
          <span className="font-medium text-foreground">{detail.station}</span>
        </p>
        <p>
          {WORKER_COPY.processOrderPreviousStationLabel}:{' '}
          <span className="font-medium text-foreground">
            {detail.previousStation ?? WORKER_COPY.unavailable}
          </span>
        </p>
        <p>
          {WORKER_COPY.processOrderPaymentStatusLabel}:{' '}
          <span className="font-medium text-foreground">{detail.paymentStatus}</span>
        </p>
        <p>
          {WORKER_COPY.queueCustomer}:{' '}
          <span className="font-medium text-foreground">
            {detail.customerName ?? WORKER_COPY.unavailable}
          </span>
        </p>
        <p>
          {WORKER_COPY.queueOutlet}:{' '}
          <span className="font-medium text-foreground">
            {detail.outletName ?? WORKER_COPY.unavailable}
          </span>
        </p>
        <p>
          {WORKER_COPY.queueTotalItems}:{' '}
          <span className="font-medium text-foreground">{detail.totalItems}</span>
        </p>
        <div className="flex items-center gap-2">
          <span>{WORKER_COPY.statusLabel}:</span>
          <Badge variant="secondary">{getWorkerStatusLabel(detail.stationStatus)}</Badge>
        </div>
        <p className="md:col-span-2 xl:col-span-4">
          Updated{' '}
          <span className="font-medium text-foreground">
            {formatWorkerDateTime(detail.updatedAt)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
