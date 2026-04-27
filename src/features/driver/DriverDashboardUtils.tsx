import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Truck, MapPin } from 'lucide-react';
import { DRIVER_UI_TEXT } from '@/utils/driver';
import type { DriverActiveTask } from '@/types/delivery';

export function StatusHero({ name }: { name: string }) {
  return (
    <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
              On Duty
            </span>
          </div>
          <h1 className="text-xl font-bold font-heading mt-1">Hi, {name}</h1>
          <p className="text-sm opacity-90 mt-0.5">
            {DRIVER_UI_TEXT.dashboardDescription}
          </p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
          <Truck className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

export function NextStopCard({ task }: { task: DriverActiveTask }) {
  const label = task.type === 'pickup' ? 'Pickup' : 'Delivery';
  const addressLine = [
    task.address.label,
    task.address.street,
    task.address.city,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <Card className="rounded-2xl shadow-sm border-primary/30 bg-card overflow-hidden">
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Next Stop · {label}
            </p>
            <p className="font-bold text-foreground mt-0.5">
              {task.customerName ?? DRIVER_UI_TEXT.unavailable}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {addressLine}
            </p>
          </div>
        </div>
        <Link to="/driver/active" className="block">
          <Button className="w-full rounded-xl h-11">
            Continue Task <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function TabLoading() {
  return (
    <Card className="rounded-2xl border-border/60 mt-4">
      <CardContent className="py-10 text-center text-muted-foreground text-sm">
        Loading...
      </CardContent>
    </Card>
  );
}

export function TabError({ message }: { message: string }) {
  return (
    <Card className="rounded-2xl border-border/60 mt-4">
      <CardContent className="py-10 text-center text-destructive text-sm">
        {message}
      </CardContent>
    </Card>
  );
}

export function TabEmpty({ message }: { message: string }) {
  return (
    <Card className="rounded-2xl border-border/60 mt-4">
      <CardContent className="py-12 text-center text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}

export function TabPagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        {DRIVER_UI_TEXT.paginationPrevious}
      </Button>
      <span>
        {DRIVER_UI_TEXT.paginationPagePrefix} {page} {DRIVER_UI_TEXT.paginationOf}{' '}
        {total}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        {DRIVER_UI_TEXT.paginationNext}
      </Button>
    </div>
  );
}
