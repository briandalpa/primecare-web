import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatus } from '@/types/enums';
import { ORDER_STATUS_LABEL } from '@/utils/orderStatus';

const STATUS_OPTIONS = Object.values(OrderStatus);

type Props = {
  search: string;
  status: string;
  outletId: string;
  sortValue: string;
  isSuperAdmin: boolean;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onOutletIdChange: (v: string) => void;
  onSortChange: (v: string) => void;
};

export default function OrderFilters({
  search,
  status,
  outletId,
  sortValue,
  isSuperAdmin,
  onSearchChange,
  onStatusChange,
  onOutletIdChange,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[220px]">
          <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isSuperAdmin && (
        <Input
          placeholder="Filter by outlet ID..."
          value={outletId}
          onChange={(e) => onOutletIdChange(e.target.value)}
          className="max-w-[200px]"
        />
      )}

      <Select value={sortValue} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="totalPrice-desc">Price High→Low</SelectItem>
          <SelectItem value="totalPrice-asc">Price Low→High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
