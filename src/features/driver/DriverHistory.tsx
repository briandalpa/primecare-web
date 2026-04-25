import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, History } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePickupHistory } from '@/hooks/usePickupHistory';
import { useDeliveryHistory } from '@/hooks/useDeliveryHistory';
import {
  DRIVER_COPY,
  DRIVER_HISTORY_DEFAULT_FILTERS,
  formatDriverDateTime,
} from '@/utils/driver';
import { OrderStatus } from '@/types/enums';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/utils/orderStatus';
import type { PickupHistoryItem, DeliveryHistoryItem } from '@/types/delivery';

type HistoryRow = {
  id: string;
  label: string;
  customer: string;
  address: string;
  date: string;
  status: string;
};

function pickupToRow(item: PickupHistoryItem): HistoryRow {
  return {
    id: item.id,
    label: item.orderId ?? item.id,
    customer: item.customerName ?? DRIVER_COPY.unavailable,
    address: [item.pickupAddress.label, item.pickupAddress.city]
      .filter(Boolean)
      .join(', '),
    date: formatDriverDateTime(item.completedAt),
    status: item.status,
  };
}

function deliveryToRow(item: DeliveryHistoryItem): HistoryRow {
  return {
    id: item.id,
    label: item.orderId,
    customer: item.customer.name ?? DRIVER_COPY.unavailable,
    address: [item.deliveryAddress.label, item.deliveryAddress.city]
      .filter(Boolean)
      .join(', '),
    date: item.deliveredAt ? formatDriverDateTime(item.deliveredAt) : '—',
    status: item.status,
  };
}

function DriverHistory() {
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedRow, setSelectedRow] = useState<HistoryRow | null>(null);
  const [pickupPage, setPickupPage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);

  const dateStr = dateFilter
    ? dateFilter.toISOString().split('T')[0]
    : undefined;
  const limit = DRIVER_HISTORY_DEFAULT_FILTERS.limit;

  const {
    data: pickups,
    isLoading: pLoading,
    isError: pError,
  } = usePickupHistory({
    page: pickupPage,
    limit,
    fromDate: dateStr,
    toDate: dateStr,
  });
  const {
    data: deliveries,
    isLoading: dLoading,
    isError: dError,
  } = useDeliveryHistory({
    page: deliveryPage,
    limit,
    fromDate: dateStr,
    toDate: dateStr,
  });

  const handleDateChange = (d: Date | undefined) => {
    setDateFilter(d);
    setPickupPage(1);
    setDeliveryPage(1);
  };

  return (
    <div className="space-y-6">
      <HistoryHeader dateFilter={dateFilter} setDateFilter={handleDateChange} />
      <Tabs defaultValue="pickup">
        <TabsList className="grid grid-cols-2 w-full sm:w-auto sm:inline-flex bg-secondary">
          <TabsTrigger className="cursor-pointer" value="pickup">
            <span className="sm:hidden">Pickup</span>
            <span className="hidden sm:inline">
              {DRIVER_COPY.historyPickupTab}
            </span>
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="delivery">
            <span className="sm:hidden">Delivery</span>
            <span className="hidden sm:inline">
              {DRIVER_COPY.historyDeliveryTab}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pickup" className="mt-4 space-y-4">
          {pLoading ? (
            <TabLoading />
          ) : pError ? (
            <TabError message={DRIVER_COPY.historyPickupError} />
          ) : !pickups?.data.length ? (
            <EmptyHistory />
          ) : (
            <>
              <HistoryTable
                rows={pickups.data.map(pickupToRow)}
                onSelect={setSelectedRow}
              />
              {pickups.meta.totalPages > 1 && (
                <HistoryPagination
                  current={pickupPage}
                  total={pickups.meta.totalPages}
                  onPageChange={setPickupPage}
                />
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="delivery" className="mt-4 space-y-4">
          {dLoading ? (
            <TabLoading />
          ) : dError ? (
            <TabError message={DRIVER_COPY.historyDeliveryError} />
          ) : !deliveries?.data.length ? (
            <EmptyHistory />
          ) : (
            <>
              <HistoryTable
                rows={deliveries.data.map(deliveryToRow)}
                onSelect={setSelectedRow}
              />
              {deliveries.meta.totalPages > 1 && (
                <HistoryPagination
                  current={deliveryPage}
                  total={deliveries.meta.totalPages}
                  onPageChange={setDeliveryPage}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      <OrderDetailDialog
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}

function HistoryHeader({
  dateFilter,
  setDateFilter,
}: {
  dateFilter?: Date;
  setDateFilter: (d: Date | undefined) => void;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <h2 className="text-xl font-heading font-semibold text-foreground">
        Task History
      </h2>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {dateFilter
                ? format(dateFilter, 'dd MMM yyyy')
                : 'Filter by date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
            />
          </PopoverContent>
        </Popover>
        {dateFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDateFilter(undefined)}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

function HistoryTable({
  rows,
  onSelect,
}: {
  rows: HistoryRow[];
  onSelect: (row: HistoryRow) => void;
}) {
  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Address</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelect(row)}
            >
              <TableCell className="font-medium">
                <div className="truncate max-w-[5rem]">{row.label}</div>
              </TableCell>
              <TableCell>
                <div className="truncate max-w-[6rem] sm:max-w-[12rem]">
                  {row.customer}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                <div className="truncate max-w-[12rem]">{row.address}</div>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs whitespace-normal min-w-[4.5rem]">
                {row.date}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={cn(
                    'text-xs whitespace-nowrap',
                    ORDER_STATUS_COLOR[row.status as OrderStatus] ??
                      'bg-muted text-muted-foreground border-border',
                  )}
                >
                  {ORDER_STATUS_LABEL[row.status as OrderStatus] ??
                    row.status.toLowerCase().replace(/_/g, ' ')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function getPageItems(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

function HistoryPagination({
  current,
  total,
  onPageChange,
}: {
  current: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, current - 1))}
            className={cn(current === 1 && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>
        {getPageItems(current, total).map((p, i) =>
          p === '...' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <span className="px-2 text-muted-foreground select-none">…</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === current}
                onClick={() => onPageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(total, current + 1))}
            className={cn(
              current === total && 'pointer-events-none opacity-50',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function OrderDetailDialog({
  row,
  onClose,
}: {
  row: HistoryRow | null;
  onClose: () => void;
}) {
  if (!row) return null;
  return (
    <Dialog open={!!row} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>{row.label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Customer: </span>
            <span>{row.customer}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Address: </span>
            <span>{row.address}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Date: </span>
            <span>{row.date}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Status: </span>
            <Badge variant="outline" className="capitalize text-xs ml-1">
              {row.status.toLowerCase().replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EmptyHistory() {
  return (
    <Card>
      <CardContent className="py-12 text-center text-muted-foreground">
        <History className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>No completed tasks found.</p>
      </CardContent>
    </Card>
  );
}

function TabLoading() {
  return (
    <Card>
      <CardContent className="py-10 text-center text-muted-foreground text-sm">
        Loading...
      </CardContent>
    </Card>
  );
}

function TabError({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="py-10 text-center text-destructive text-sm">
        {message}
      </CardContent>
    </Card>
  );
}

export default DriverHistory;
export { DriverHistory as DriverHistoryTabs };
