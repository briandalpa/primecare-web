import { Button } from '@/components/ui/button';
import { WORKER_COPY } from '@/utils/worker';
import type { WorkerOrderMeta } from '@/types/worker-order';

type WorkerQueuePaginationProps = {
  meta: WorkerOrderMeta;
  onPageChange: (page: number) => void;
};

export function WorkerQueuePagination({
  meta,
  onPageChange,
}: WorkerQueuePaginationProps) {
  const canGoPrevious = meta.page > 1;
  const canGoNext = meta.page < meta.totalPages;

  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {WORKER_COPY.paginationPagePrefix} {meta.page} {WORKER_COPY.paginationOf}{' '}
        {meta.totalPages} • {meta.total} {WORKER_COPY.paginationTotalOrdersSuffix}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(meta.page - 1)}
        >
          {WORKER_COPY.paginationPrevious}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canGoNext}
          onClick={() => onPageChange(meta.page + 1)}
        >
          {WORKER_COPY.paginationNext}
        </Button>
      </div>
    </div>
  );
}
