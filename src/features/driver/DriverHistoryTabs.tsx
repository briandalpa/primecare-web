import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePickupHistory } from '@/hooks/usePickupHistory';
import { useDeliveryHistory } from '@/hooks/useDeliveryHistory';
import { DRIVER_COPY, DRIVER_HISTORY_DEFAULT_FILTERS, formatDriverDateTime } from '@/utils/driver';
import type { PaginationMeta } from '@/types/delivery';

type Filters = { page: number; limit: number; fromDate: string; toDate: string };

type PaginationProps = { meta: PaginationMeta; onPageChange: (p: number) => void };

function HistoryPagination({ meta, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {DRIVER_COPY.paginationPagePrefix} {meta.page} {DRIVER_COPY.paginationOf} {meta.totalPages} • {meta.total} {DRIVER_COPY.paginationTotalSuffix}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>{DRIVER_COPY.paginationPrevious}</Button>
        <Button variant="outline" disabled={meta.page >= meta.totalPages} onClick={() => onPageChange(meta.page + 1)}>{DRIVER_COPY.paginationNext}</Button>
      </div>
    </div>
  );
}

type FilterBarProps = {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onReset: () => void;
};

function HistoryFilterBar({ filters, onChange, onReset }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs">{DRIVER_COPY.fromDateLabel}</Label>
        <Input type="date" value={filters.fromDate} className="h-8 w-36 text-xs" onChange={(e) => onChange({ fromDate: e.target.value, page: 1 })} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{DRIVER_COPY.toDateLabel}</Label>
        <Input type="date" value={filters.toDate} className="h-8 w-36 text-xs" onChange={(e) => onChange({ toDate: e.target.value, page: 1 })} />
      </div>
      <Button variant="outline" size="sm" onClick={onReset}>{DRIVER_COPY.resetFilters}</Button>
    </div>
  );
}

function PickupHistoryList({ filters }: { filters: Filters }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePickupHistory({ ...filters, page });

  if (isLoading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading...</CardContent></Card>;
  if (isError) return <Card><CardContent className="p-6 text-sm text-destructive">{DRIVER_COPY.historyPickupError}</CardContent></Card>;
  if (!data || data.data.length === 0) return <Card><CardContent className="p-6 text-sm text-muted-foreground">{DRIVER_COPY.historyPickupEmpty}</CardContent></Card>;

  return (
    <div className="space-y-3">
      {data.data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm font-medium">{item.customerName ?? DRIVER_COPY.unavailable}</p>
            <p className="text-xs text-muted-foreground">
              {item.pickupAddress.label} — {item.pickupAddress.street}, {item.pickupAddress.city}
            </p>
            <p className="text-xs text-muted-foreground">
              {DRIVER_COPY.historyCompletedAtLabel}: {formatDriverDateTime(item.completedAt)}
            </p>
            {item.orderId && (
              <p className="text-xs text-muted-foreground font-mono">
                {DRIVER_COPY.orderIdLabel}: {item.orderId.slice(0, 8)}…
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      <HistoryPagination meta={data.meta} onPageChange={setPage} />
    </div>
  );
}

function DeliveryHistoryList({ filters }: { filters: Filters }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useDeliveryHistory({ ...filters, page });

  if (isLoading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading...</CardContent></Card>;
  if (isError) return <Card><CardContent className="p-6 text-sm text-destructive">{DRIVER_COPY.historyDeliveryError}</CardContent></Card>;
  if (!data || data.data.length === 0) return <Card><CardContent className="p-6 text-sm text-muted-foreground">{DRIVER_COPY.historyDeliveryEmpty}</CardContent></Card>;

  return (
    <div className="space-y-3">
      {data.data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm font-medium">{item.customer.name ?? DRIVER_COPY.unavailable}</p>
            <p className="text-xs text-muted-foreground">
              {item.deliveryAddress.label} — {item.deliveryAddress.street}, {item.deliveryAddress.city}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {DRIVER_COPY.orderIdLabel}: {item.orderId.slice(0, 8)}…
            </p>
            {item.deliveredAt && (
              <p className="text-xs text-muted-foreground">
                {DRIVER_COPY.historyDeliveredAtLabel}: {formatDriverDateTime(item.deliveredAt)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      <HistoryPagination meta={data.meta} onPageChange={setPage} />
    </div>
  );
}

export function DriverHistoryTabs() {
  const [pickupFilters, setPickupFilters] = useState<Filters>({ ...DRIVER_HISTORY_DEFAULT_FILTERS });
  const [deliveryFilters, setDeliveryFilters] = useState<Filters>({ ...DRIVER_HISTORY_DEFAULT_FILTERS });

  return (
    <Tabs defaultValue="pickup">
      <TabsList className="mb-4">
        <TabsTrigger value="pickup">{DRIVER_COPY.historyPickupTab}</TabsTrigger>
        <TabsTrigger value="delivery">{DRIVER_COPY.historyDeliveryTab}</TabsTrigger>
      </TabsList>

      <TabsContent value="pickup" className="space-y-4">
        <HistoryFilterBar
          filters={pickupFilters}
          onChange={(f) => setPickupFilters((prev) => ({ ...prev, ...f }))}
          onReset={() => setPickupFilters({ ...DRIVER_HISTORY_DEFAULT_FILTERS })}
        />
        <PickupHistoryList filters={pickupFilters} />
      </TabsContent>

      <TabsContent value="delivery" className="space-y-4">
        <HistoryFilterBar
          filters={deliveryFilters}
          onChange={(f) => setDeliveryFilters((prev) => ({ ...prev, ...f }))}
          onReset={() => setDeliveryFilters({ ...DRIVER_HISTORY_DEFAULT_FILTERS })}
        />
        <DeliveryHistoryList filters={deliveryFilters} />
      </TabsContent>
    </Tabs>
  );
}
