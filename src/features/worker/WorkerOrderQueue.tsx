import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkerQueuePagination } from '@/features/worker/WorkerQueuePagination';
import {
  WORKER_COPY,
  WORKER_STATUS_BADGE_VARIANT,
  formatWorkerDateTime,
  getWorkerOrderProcessRoute,
  getWorkerStatusLabel,
} from '@/utils/worker';
import type { WorkerOrderListResponse, WorkerOrderStatus } from '@/types/worker-order';

type WorkerOrderQueueProps = {
  response?: WorkerOrderListResponse;
  isLoading: boolean;
  isError: boolean;
  onPageChange: (page: number) => void;
};

type WorkerQueueStateProps = {
  text: string;
  tone: 'default' | 'destructive';
};

function WorkerQueueState({ text, tone }: WorkerQueueStateProps) {
  const className =
    tone === 'destructive'
      ? 'p-6 text-sm text-destructive'
      : 'p-6 text-sm text-muted-foreground';

  return (
    <Card>
      <CardContent className={className}>{text}</CardContent>
    </Card>
  );
}

function WorkerOrderStatusBadge({ status }: { status: WorkerOrderStatus }) {
  return (
    <Badge variant={WORKER_STATUS_BADGE_VARIANT[status]}>
      {getWorkerStatusLabel(status)}
    </Badge>
  );
}

function WorkerOrderQueueSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function WorkerOrderCard({
  order,
}: {
  order: WorkerOrderListResponse['data'][number];
}) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg">{order.orderId}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Updated {formatWorkerDateTime(order.updatedAt)}
            </p>
          </div>
          <WorkerOrderStatusBadge status={order.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>{WORKER_COPY.queueTotalItems}: {order.totalItems}</p>
          <p>{WORKER_COPY.queueStation}: {order.station}</p>
          <p>{WORKER_COPY.queueCustomer}: {order.customerName ?? WORKER_COPY.unavailable}</p>
          <p>{WORKER_COPY.queueOutlet}: {order.outletName ?? WORKER_COPY.unavailable}</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to={getWorkerOrderProcessRoute(order.orderId)}>
            {WORKER_COPY.processOrderTitle}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function WorkerOrderQueue({
  response,
  isLoading,
  isError,
  onPageChange,
}: WorkerOrderQueueProps) {
  if (isLoading) return <WorkerOrderQueueSkeleton />;
  if (isError) return <WorkerQueueState text={WORKER_COPY.queueLoadError} tone="destructive" />;

  if (!response || response.data.length === 0) {
    return <WorkerQueueState text={WORKER_COPY.queueEmpty} tone="default" />;
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {response.data.map((order) => (
          <WorkerOrderCard key={order.id} order={order} />
        ))}
      </div>
      <WorkerQueuePagination meta={response.meta} onPageChange={onPageChange} />
    </section>
  );
}
