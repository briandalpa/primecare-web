import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  WORKER_COPY,
  WORKER_STATUS_FILTER_OPTIONS,
} from '@/utils/worker';
import type { WorkerOrderListParams } from '@/types/worker-order';

type WorkerOrderFiltersProps = {
  filters: WorkerOrderListParams;
  onStatusChange: (status: WorkerOrderListParams['status']) => void;
  onDateChange: (date: string) => void;
  onReset: () => void;
};

export function WorkerOrderFilters({
  filters,
  onStatusChange,
  onDateChange,
  onReset,
}: WorkerOrderFiltersProps) {
  return (
    <section className="rounded-xl border bg-background p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium">{WORKER_COPY.statusLabel}</p>
          <Select
            value={filters.status ?? 'ALL'}
            onValueChange={(value) =>
              onStatusChange(value as WorkerOrderListParams['status'])
            }
          >
            <SelectTrigger className="w-full min-w-[180px]">
              <SelectValue placeholder={WORKER_COPY.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {WORKER_STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value ?? 'ALL'}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{WORKER_COPY.dateLabel}</p>
          <Input
            type="date"
            value={filters.date ?? ''}
            onChange={(event) => onDateChange(event.target.value)}
            className="min-w-[180px]"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="lg:ml-auto"
        >
          <FilterX className="h-4 w-4" />
          {WORKER_COPY.resetFilters}
        </Button>
      </div>
    </section>
  );
}
