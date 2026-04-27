import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { History, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DisplayRow } from '@/types/driverHistory';
import { HistoryTable } from './DriverHistoryTable';

export function HistoryBody({
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

export function HistoryPagination({
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
