import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkerQueuePagination } from '@/features/worker/WorkerQueuePagination';
import { WorkerHistoryDetailDialog } from '@/features/worker/WorkerHistoryDetailDialog';
import type { WorkerHistoryResponse } from '@/types/worker-order';
import {
  formatWorkerDateTime,
  getWorkerStationLabel,
  WORKER_COPY,
} from '@/utils/worker';

type WorkerHistoryListProps = {
  isError: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  response?: WorkerHistoryResponse;
};

export function WorkerHistoryList({
  isError,
  isLoading,
  onPageChange,
  response,
}: WorkerHistoryListProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading worker history...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">
          {WORKER_COPY.historyLoadError}
        </CardContent>
      </Card>
    );
  }

  if (!response || response.data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          {WORKER_COPY.historyEmpty}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {response.data.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">{item.orderId}</p>
                  <p className="text-sm text-muted-foreground">
                    {WORKER_COPY.historyCompletedAtLabel}:{' '}
                    {formatWorkerDateTime(item.completedAt)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedOrderId(item.orderId)}
                >
                  {WORKER_COPY.historyOpenDetail}
                </Button>
              </div>

              <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                <p>
                  {WORKER_COPY.queueTotalItems}: <span className="text-foreground">{item.totalItems}</span>
                </p>
                <p>
                  {WORKER_COPY.queueStation}:{' '}
                  <span className="text-foreground">
                    {getWorkerStationLabel(item.station) ?? item.station}
                  </span>
                </p>
                <p>
                  {WORKER_COPY.queueCustomer}:{' '}
                  <span className="text-foreground">
                    {item.customerName ?? WORKER_COPY.unavailable}
                  </span>
                </p>
                <p>
                  {WORKER_COPY.queueOutlet}:{' '}
                  <span className="text-foreground">
                    {item.outletName ?? WORKER_COPY.unavailable}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <WorkerQueuePagination meta={response.meta} onPageChange={onPageChange} />

      <WorkerHistoryDetailDialog
        open={!!selectedOrderId}
        orderId={selectedOrderId}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId(null);
        }}
      />
    </>
  );
}
