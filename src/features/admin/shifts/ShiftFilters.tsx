import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Outlet } from '@/types/outlet';
import type { User } from '@/types/user';

type ShiftFiltersProps = {
  isSuperAdmin: boolean;
  outletId: string;
  selectedWorkerId: string;
  status: 'ALL' | 'ACTIVE' | 'ENDED';
  workers: User[];
  outlets: Outlet[];
  onOutletChange: (value: string) => void;
  onWorkerChange: (value: string) => void;
  onStatusChange: (value: 'ALL' | 'ACTIVE' | 'ENDED') => void;
};

export function ShiftFilters({
  isSuperAdmin,
  outletId,
  selectedWorkerId,
  status,
  workers,
  outlets,
  onOutletChange,
  onWorkerChange,
  onStatusChange,
}: ShiftFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {isSuperAdmin && (
        <Select value={outletId || 'ALL'} onValueChange={onOutletChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All outlets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All outlets</SelectItem>
            {outlets.map((outlet) => (
              <SelectItem key={outlet.id} value={outlet.id}>
                {outlet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={selectedWorkerId || 'ALL'} onValueChange={onWorkerChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All workers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All workers</SelectItem>
          {workers.map((worker) => (
            <SelectItem key={worker.id} value={worker.id}>
              {worker.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="ENDED">Ended</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
