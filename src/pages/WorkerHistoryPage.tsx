import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WorkerHistoryFilters } from '@/features/worker/WorkerHistoryFilters';
import { WorkerHistoryList } from '@/features/worker/WorkerHistoryList';
import { useWorkerHistory } from '@/hooks/useWorkerHistory';
import type { WorkerHistoryParams } from '@/types/worker-order';
import {
  WORKER_COPY,
  WORKER_DOCUMENT_TITLE,
  WORKER_HISTORY_DEFAULT_FILTERS,
} from '@/utils/worker';

function getFilters(searchParams: URLSearchParams): WorkerHistoryParams {
  return {
    page: Number(
      searchParams.get('page') ?? String(WORKER_HISTORY_DEFAULT_FILTERS.page),
    ),
    limit: WORKER_HISTORY_DEFAULT_FILTERS.limit,
    station:
      (searchParams.get('station') as WorkerHistoryParams['station']) ??
      WORKER_HISTORY_DEFAULT_FILTERS.station,
    date: searchParams.get('date') ?? WORKER_HISTORY_DEFAULT_FILTERS.date,
  };
}

export default function WorkerHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = getFilters(searchParams);
  const workerHistory = useWorkerHistory(filters);

  useEffect(() => {
    document.title = WORKER_DOCUMENT_TITLE.history;
  }, []);

  const setFilterParam = (key: 'station' | 'date', value?: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('page', String(WORKER_HISTORY_DEFAULT_FILTERS.page));
      if (!value || value === WORKER_HISTORY_DEFAULT_FILTERS[key]) next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('page', String(page));
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {WORKER_COPY.historyTitle}
        </h1>
        <p className="text-muted-foreground">{WORKER_COPY.historyDescription}</p>
      </div>

      <WorkerHistoryFilters
        filters={filters}
        onStationChange={(station) => setFilterParam('station', station)}
        onDateChange={(date) => setFilterParam('date', date)}
        onReset={() => setSearchParams({ page: String(WORKER_HISTORY_DEFAULT_FILTERS.page) })}
      />

      <WorkerHistoryList
        response={workerHistory.data}
        isLoading={workerHistory.isLoading}
        isError={workerHistory.isError}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
