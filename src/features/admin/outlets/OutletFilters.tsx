import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OutletFiltersProps = {
  search: string;
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'ALL' | 'ACTIVE' | 'INACTIVE') => void;
};

export function OutletFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: OutletFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Input
        placeholder="Search outlet..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="max-w-xs"
      />

      <Select
        value={status}
        onValueChange={(value) =>
          onStatusChange(value as 'ALL' | 'ACTIVE' | 'INACTIVE')
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
