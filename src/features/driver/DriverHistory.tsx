import { useState } from 'react';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
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
import { CalendarIcon, Eye, History, Loader2 } from 'lucide-react';
import { useDeliveryHistory } from '@/hooks/useDeliveryHistory';
import { usePickupHistory } from '@/hooks/usePickupHistory';
import { useDriverDeliveryOrder } from '@/hooks/useDriverDeliveryOrder';
import type { DeliveryHistoryItem, PickupHistoryItem } from '@/types/delivery';
import {
  DRIVER_COPY,
  DRIVER_HISTORY_DEFAULT_FILTERS,
  formatDriverDateTime,
} from '@/utils/driver';
import { cn } from '@/lib/utils';

const PAGE_SIZE = DRIVER_HISTORY_DEFAULT_FILTERS.limit;
type Tab = 'all' | 'delivery' | 'pickup';

type DisplayRow = {
  id: string;
  label: string;
  date: string;
  rawDate: string;
  customer: string;
  address: string;
  type: 'delivery' | 'pickup';
  raw: DeliveryHistoryItem | PickupHistoryItem;
};

function toRow(
  item: DeliveryHistoryItem | PickupHistoryItem,
  tab: 'delivery' | 'pickup',
): DisplayRow {
  if (tab === 'delivery') {
    const d = item as DeliveryHistoryItem;
    return {
      id: d.id,
      label: `Delivery #${d.id.slice(-6).toUpperCase()}`,
      date: d.deliveredAt ? formatDriverDateTime(d.deliveredAt) : '—',
      rawDate: d.deliveredAt ?? d.createdAt,
      customer: d.customer.name ?? '—',
      address: `${d.deliveryAddress.street}, ${d.deliveryAddress.city}`,
      type: 'delivery',
      raw: d,
    };
  }
  const p = item as PickupHistoryItem;
  return {
    id: p.id,
    label: `Pickup #${p.id.slice(-6).toUpperCase()}`,
    date: formatDriverDateTime(p.completedAt),
    rawDate: p.completedAt,
    customer: p.customerName ?? '—',
    address: `${p.pickupAddress.street}, ${p.pickupAddress.city}`,
    type: 'pickup',
    raw: p,
  };
}

export default function DriverHistory() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(
    null,
  );
  const [selectedPickup, setSelectedPickup] =
    useState<PickupHistoryItem | null>(null);

  const deliveryQuery = useDeliveryHistory({
    page,
    limit: PAGE_SIZE,
    fromDate,
    toDate,
  });
  const pickupQuery = usePickupHistory({
    page,
    limit: PAGE_SIZE,
    fromDate,
    toDate,
  });

  const deliveryRows = (deliveryQuery.data?.data ?? []).map((item) =>
    toRow(item, 'delivery'),
  );
  const pickupRows = (pickupQuery.data?.data ?? []).map((item) =>
    toRow(item, 'pickup'),
  );

  const rows =
    activeTab === 'all'
      ? [...deliveryRows, ...pickupRows].sort(
          (a, b) =>
            new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime(),
        )
      : activeTab === 'delivery'
      ? deliveryRows
      : pickupRows;

  const isLoading =
    activeTab === 'all'
      ? deliveryQuery.isLoading || pickupQuery.isLoading
      : activeTab === 'delivery'
      ? deliveryQuery.isLoading
      : pickupQuery.isLoading;

  const isError =
    activeTab === 'all'
      ? deliveryQuery.isError && pickupQuery.isError
      : activeTab === 'delivery'
      ? deliveryQuery.isError
      : pickupQuery.isError;

  const totalPages =
    activeTab === 'all'
      ? 1
      : (activeTab === 'delivery' ? deliveryQuery : pickupQuery).data?.meta
          .totalPages ?? 1;

  const applyFilter = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(1);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleRowSelect = (row: DisplayRow) => {
    if (row.type === 'delivery') setSelectedDeliveryId(row.id);
    else setSelectedPickup(row.raw as PickupHistoryItem);
  };

  return (
    <div className="space-y-5 md:space-y-8">
      <HistoryHeader
        activeTab={activeTab}
        fromDate={fromDate}
        toDate={toDate}
        onTabChange={handleTabChange}
        onFilterChange={applyFilter}
      />
      <HistoryBody
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        onSelect={handleRowSelect}
      />
      {totalPages > 1 && (
        <HistoryPagination
          current={page}
          total={totalPages}
          onPageChange={setPage}
        />
      )}
      <DeliveryDetailDialog
        deliveryId={selectedDeliveryId}
        onClose={() => setSelectedDeliveryId(null)}
      />
      <PickupDetailDialog
        pickup={selectedPickup}
        onClose={() => setSelectedPickup(null)}
      />
    </div>
  );
}

function HistoryHeader({
  activeTab,
  fromDate,
  toDate,
  onTabChange,
  onFilterChange,
}: {
  activeTab: Tab;
  fromDate: string;
  toDate: string;
  onTabChange: (tab: Tab) => void;
  onFilterChange: (from: string, to: string) => void;
}) {
  const setPreset = (days: number) => {
    const from = startOfDay(subDays(new Date(), days)).toISOString();
    const to = endOfDay(new Date()).toISOString();
    onFilterChange(from, to);
  };

  const fromDateObj = fromDate ? new Date(fromDate) : undefined;
  const toDateObj = toDate ? new Date(toDate) : undefined;

  const setFrom = (d: Date | undefined) =>
    onFilterChange(d ? startOfDay(d).toISOString() : '', toDate);
  const setTo = (d: Date | undefined) =>
    onFilterChange(fromDate, d ? endOfDay(d).toISOString() : '');

  return (
    <header className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-3xl font-heading font-bold text-primary md:text-2xl">
          Route History
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">
          {DRIVER_COPY.historyDescription}
        </p>
      </div>
      <div className="-mx-4 flex max-w-[calc(100vw-2rem)] items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          size="sm"
          className="shrink-0 rounded-full px-5"
          onClick={() => {
            onTabChange('all');
            onFilterChange('', '');
          }}
        >
          {DRIVER_COPY.historyAllTab}
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'delivery' ? 'default' : 'outline'}
          className="shrink-0 rounded-full px-5"
          onClick={() => onTabChange('delivery')}
        >
          {DRIVER_COPY.historyDeliveryTab}
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'pickup' ? 'default' : 'outline'}
          className="shrink-0 rounded-full px-5"
          onClick={() => onTabChange('pickup')}
        >
          {DRIVER_COPY.historyPickupTab}
        </Button>
        <div className="mx-1 h-5 w-px bg-border/60 shrink-0" />
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-full px-5"
          onClick={() => setPreset(7)}
        >
          Last 7 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-full px-5"
          onClick={() => setPreset(30)}
        >
          Last Month
        </Button>
        <DatePickerButton
          label={DRIVER_COPY.fromDateLabel}
          value={fromDateObj}
          onChange={setFrom}
        />
        <DatePickerButton
          label={DRIVER_COPY.toDateLabel}
          value={toDateObj}
          onChange={setTo}
        />
      </div>
    </header>
  );
}

function DatePickerButton({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-2 rounded-full px-4"
        >
          <CalendarIcon className="h-4 w-4" />
          {value ? `${label}: ${format(value, 'dd MMM')}` : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}

function HistoryBody({
  rows,
  isLoading,
  isError,
  onSelect,
}: {
  rows: DisplayRow[];
  isLoading: boolean;
  isError: boolean;
  onSelect: (row: DisplayRow) => void;
}) {
  if (isLoading) return <HistoryLoading />;
  if (isError) return <HistoryError />;
  if (rows.length === 0) return <EmptyHistory />;
  return (
    <>
      <MobileRouteCards rows={rows} onSelect={onSelect} />
      <HistoryTable rows={rows} onSelect={onSelect} />
    </>
  );
}

function HistoryLoading() {
  return (
    <Card className="rounded-2xl border-border/70">
      <CardContent className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
}

function HistoryError() {
  return (
    <Card className="rounded-2xl border-dashed">
      <CardContent className="py-12 text-center text-destructive">
        <p>Failed to load history. Please refresh.</p>
      </CardContent>
    </Card>
  );
}

function EmptyHistory() {
  return (
    <Card className="rounded-2xl border-dashed">
      <CardContent className="py-12 text-center text-muted-foreground">
        <History className="mx-auto mb-3 h-12 w-12 opacity-40" />
        <p>No completed tasks found.</p>
      </CardContent>
    </Card>
  );
}

function MobileRouteCards({
  rows,
  onSelect,
}: {
  rows: DisplayRow[];
  onSelect: (row: DisplayRow) => void;
}) {
  return (
    <section className="space-y-4 md:hidden">
      <h3 className="text-2xl font-bold text-foreground">Recent Routes</h3>
      {rows.map((row) => (
        <button
          key={row.id}
          onClick={() => onSelect(row)}
          className="w-full rounded-2xl border bg-card p-5 text-left shadow-sm transition-colors hover:bg-muted/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-foreground">{row.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{row.date}</p>
            </div>
            <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary shadow-none capitalize">
              {row.type}
            </Badge>
          </div>
          <div className="my-4 h-px bg-border/70" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">
                Customer
              </p>
              <p className="mt-1 font-bold text-foreground">{row.customer}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">
                Address
              </p>
              <p className="mt-1 truncate font-bold text-foreground">
                {row.address}
              </p>
            </div>
          </div>
        </button>
      ))}
    </section>
  );
}

function HistoryTable({
  rows,
  onSelect,
}: {
  rows: DisplayRow[];
  onSelect: (row: DisplayRow) => void;
}) {
  return (
    <Card className="hidden rounded-2xl border-border/70 shadow-sm md:block px-6 py-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="hidden sm:table-cell">Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Address</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelect(row)}
            >
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize text-xs">
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {row.date}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {row.customer}
              </TableCell>
              <TableCell className="hidden max-w-[200px] truncate sm:table-cell text-muted-foreground">
                {row.address}
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-primary/10 text-primary shadow-none">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Eye className="ml-auto h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
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
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === current}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
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

function DeliveryDetailDialog({
  deliveryId,
  onClose,
}: {
  deliveryId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useDriverDeliveryOrder(deliveryId ?? undefined);

  return (
    <Dialog open={!!deliveryId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="left-[50%] w-[calc(100%-2rem)] max-w-md translate-x-[-50%] sm:w-full">
        <DialogHeader>
          <DialogTitle>
            Delivery #{deliveryId?.slice(-6).toUpperCase()}
          </DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {data && (
          <div className="space-y-3 text-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      Rp{' '}
                      {(item.quantity * item.unitPrice).toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Delivery Fee</span>
              <span>Rp {data.deliveryFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                Rp{' '}
                {(data.totalPrice + data.deliveryFee).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PickupDetailDialog({
  pickup,
  onClose,
}: {
  pickup: PickupHistoryItem | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!pickup} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="left-[50%] w-[calc(100%-2rem)] max-w-md translate-x-[-50%] sm:w-full">
        <DialogHeader>
          <DialogTitle>
            Pickup #{pickup?.id.slice(-6).toUpperCase()}
          </DialogTitle>
        </DialogHeader>
        {pickup && (
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Customer: </span>
              <span>{pickup.customerName ?? '—'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Address: </span>
              <span>
                {pickup.pickupAddress.street}, {pickup.pickupAddress.city}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">
                {DRIVER_COPY.historyCompletedAtLabel}:{' '}
              </span>
              <span>{formatDriverDateTime(pickup.completedAt)}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
