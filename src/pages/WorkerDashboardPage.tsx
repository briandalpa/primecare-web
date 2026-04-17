import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  WORKER_DEFAULT_FILTERS,
  WORKER_DOCUMENT_TITLE,
} from '@/utils/worker';
import { WorkerDashboardHeader } from '@/features/worker/WorkerDashboardHeader';
import { WorkerOrderFilters } from '@/features/worker/WorkerOrderFilters';
import { WorkerOrderQueue } from '@/features/worker/WorkerOrderQueue';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useWorkerNotifications } from '@/hooks/useWorkerNotifications';
import { useWorkerOrders } from '@/hooks/useWorkerOrders';
import type { WorkerOrderListParams } from '@/types/worker-order';

function getFilters(searchParams: URLSearchParams): WorkerOrderListParams {
  return {
    page: Number(searchParams.get('page') ?? String(WORKER_DEFAULT_FILTERS.page)),
    limit: WORKER_DEFAULT_FILTERS.limit,
    status:
      (searchParams.get('status') as WorkerOrderListParams['status']) ??
      WORKER_DEFAULT_FILTERS.status,
    date: searchParams.get('date') ?? WORKER_DEFAULT_FILTERS.date,
  };
}

export default function WorkerDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile } = useCurrentUser();
  const filters = getFilters(searchParams);
  const workerOrders = useWorkerOrders(filters);
  const notifications = useWorkerNotifications({
    enabled: !!profile?.staff?.workerType,
  });

  useEffect(() => {
    document.title = WORKER_DOCUMENT_TITLE.dashboard;
  }, []);

  const handlePageChange = (page: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('page', String(page));
      return next;
    });
  };

  const handleStatusChange = (status: WorkerOrderListParams['status']) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('page', String(WORKER_DEFAULT_FILTERS.page));
      if (!status || status === WORKER_DEFAULT_FILTERS.status) next.delete('status');
      else next.set('status', status);
      return next;
    });
  };

  const handleDateChange = (date: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('page', String(WORKER_DEFAULT_FILTERS.page));
      if (!date) next.delete('date');
      else next.set('date', date);
      return next;
    });
  };

  const handleReset = () =>
    setSearchParams({ page: String(WORKER_DEFAULT_FILTERS.page) });

  const queueCount = workerOrders.data?.meta.total ?? 0;

  return (
    <div className="space-y-6">
      <WorkerDashboardHeader
        station={profile?.staff?.workerType}
        queueCount={queueCount}
        notificationCount={notifications.notificationCount}
        isShiftActive={profile?.staff?.isActive ?? false}
      />

      <WorkerOrderFilters
        filters={filters}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onReset={handleReset}
      />

      <WorkerOrderQueue
        response={workerOrders.data}
        isLoading={workerOrders.isLoading}
        isError={workerOrders.isError}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
