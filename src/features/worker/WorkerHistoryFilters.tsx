import type { WorkerHistoryParams } from '@/types/worker-order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WORKER_COPY, WORKER_STATION_LABEL } from '@/utils/worker';

type WorkerHistoryFiltersProps = {
  filters: WorkerHistoryParams;
  onStationChange: (station: WorkerHistoryParams['station']) => void;
  onDateChange: (date: string) => void;
  onReset: () => void;
};

const stationOptions: Array<{ value: WorkerHistoryParams['station']; label: string }> = [
  { value: 'ALL', label: WORKER_COPY.historyAllStations },
  { value: 'WASHING', label: WORKER_STATION_LABEL.WASHING },
  { value: 'IRONING', label: WORKER_STATION_LABEL.IRONING },
  { value: 'PACKING', label: WORKER_STATION_LABEL.PACKING },
];

export function WorkerHistoryFilters({
  filters,
  onStationChange,
  onDateChange,
  onReset,
}: WorkerHistoryFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 md:flex-row md:items-end md:justify-between">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            {WORKER_COPY.processOrderStationLabel}
          </span>
          <Select
            value={filters.station ?? 'ALL'}
            onValueChange={(value) =>
              onStationChange(value as WorkerHistoryParams['station'])
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={WORKER_COPY.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {stationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value ?? 'ALL'}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            {WORKER_COPY.dateLabel}
          </span>
          <Input
            type="date"
            value={filters.date ?? ''}
            onChange={(event) => onDateChange(event.target.value)}
            className="sm:w-[180px]"
          />
        </label>
      </div>

      <Button type="button" variant="outline" onClick={onReset}>
        {WORKER_COPY.resetFilters}
      </Button>
    </div>
  );
}
