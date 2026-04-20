import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAvailableDeliveries } from '@/hooks/useAvailableDeliveries';
import { useAcceptDelivery } from '@/hooks/useAcceptDelivery';
import { DRIVER_COPY, formatDriverDateTime } from '@/utils/driver';
import type { PaginationMeta } from '@/types/delivery';

type DriverPaginationProps = { meta: PaginationMeta; onPageChange: (p: number) => void };

function DriverPagination({ meta, onPageChange }: DriverPaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {DRIVER_COPY.paginationPagePrefix} {meta.page} {DRIVER_COPY.paginationOf}{' '}
        {meta.totalPages} • {meta.total} {DRIVER_COPY.paginationTotalSuffix}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
          {DRIVER_COPY.paginationPrevious}
        </Button>
        <Button variant="outline" disabled={meta.page >= meta.totalPages} onClick={() => onPageChange(meta.page + 1)}>
          {DRIVER_COPY.paginationNext}
        </Button>
      </div>
    </div>
  );
}

type Props = { page: number; onPageChange: (p: number) => void };

export function DriverDeliveryList({ page, onPageChange }: Props) {
  const { data, isLoading, isError } = useAvailableDeliveries({ page, limit: 10 });
  const accept = useAcceptDelivery();

  if (isLoading) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading...</CardContent></Card>;
  }

  if (isError) {
    return <Card><CardContent className="p-6 text-sm text-destructive">{DRIVER_COPY.deliveryLoadError}</CardContent></Card>;
  }

  if (!data || data.data.length === 0) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">{DRIVER_COPY.deliveryEmptyState}</CardContent></Card>;
  }

  return (
    <div className="space-y-3">
      {data.data.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{item.customer.name ?? DRIVER_COPY.unavailable}</p>
              <p className="text-xs text-muted-foreground">
                {item.deliveryAddress.label} — {item.deliveryAddress.street}, {item.deliveryAddress.city}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {DRIVER_COPY.orderIdLabel}: {item.orderId.slice(0, 8)}…
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDriverDateTime(item.createdAt)}
              </p>
            </div>
            <Button
              size="sm"
              disabled={accept.isPending}
              onClick={() => accept.mutate(item.id)}
            >
              {accept.isPending ? DRIVER_COPY.accepting : DRIVER_COPY.acceptButton}
            </Button>
          </CardContent>
        </Card>
      ))}
      <DriverPagination meta={data.meta} onPageChange={onPageChange} />
    </div>
  );
}
