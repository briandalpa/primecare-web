import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUnassignedPickupRequests } from '@/hooks/useUnassignedPickupRequests';
import { useAcceptPickupRequest } from '@/hooks/useAcceptPickupRequest';
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

export function DriverPickupRequestList({ page, onPageChange }: Props) {
  const { data, isLoading, isError } = useUnassignedPickupRequests({ page, limit: 10 });
  const accept = useAcceptPickupRequest();

  if (isLoading) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading...</CardContent></Card>;
  }

  if (isError) {
    return <Card><CardContent className="p-6 text-sm text-destructive">{DRIVER_COPY.pickupLoadError}</CardContent></Card>;
  }

  if (!data || data.data.length === 0) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">{DRIVER_COPY.pickupEmptyState}</CardContent></Card>;
  }

  return (
    <div className="space-y-3">
      {data.data.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{item.customer.name ?? DRIVER_COPY.unavailable}</p>
              <p className="text-xs text-muted-foreground">
                {item.address.label} — {item.address.street}, {item.address.city}
              </p>
              <p className="text-xs text-muted-foreground">
                {DRIVER_COPY.scheduledAtLabel}: {formatDriverDateTime(item.scheduledAt)}
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
