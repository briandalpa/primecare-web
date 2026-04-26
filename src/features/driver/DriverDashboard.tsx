import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Clock, ArrowRight, Package, Truck } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useUnassignedPickupRequests } from '@/hooks/useUnassignedPickupRequests';
import { useAvailableDeliveries } from '@/hooks/useAvailableDeliveries';
import { useAcceptPickupRequest } from '@/hooks/useAcceptPickupRequest';
import { useAcceptDelivery } from '@/hooks/useAcceptDelivery';
import { DRIVER_COPY, formatDriverDateTime } from '@/utils/driver';
import { useDriverActiveTask } from '@/hooks/useDriverActiveTask';
import type {
  DriverActiveTask,
  DriverPickupListItem,
  DeliveryListItem,
} from '@/types/delivery';

export default function DriverDashboard() {
  const { data: session } = useSession();
  const [pickupPage, setPickupPage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);
  const { data: activeTask } = useDriverActiveTask();

  const {
    data: pickups,
    isLoading: pLoading,
    isError: pError,
  } = useUnassignedPickupRequests({ page: pickupPage, limit: 10 });
  const {
    data: deliveries,
    isLoading: dLoading,
    isError: dError,
  } = useAvailableDeliveries({ page: deliveryPage, limit: 10 });
  const acceptPickup = useAcceptPickupRequest();
  const acceptDelivery = useAcceptDelivery();

  return (
    <div className="space-y-5 max-w-full mx-auto">
      <StatusHero name={session?.user?.name?.split(' ')[0] ?? 'Driver'} />
      {activeTask && <NextStopCard task={activeTask} />}
      <Tabs defaultValue="pickup">
        <TabsList className="grid grid-cols-2 w-full sm:w-auto sm:inline-flex bg-secondary">
          <TabsTrigger value="pickup" className="gap-1.5 cursor-pointer">
            {DRIVER_COPY.pickupTabLabel}
            {!!pickups?.meta.total && (
              <Badge
                variant="destructive"
                className="text-xs ml-1 h-5 min-w-5 px-1.5"
              >
                {pickups.meta.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-1.5 cursor-pointer">
            {DRIVER_COPY.deliveryTabLabel}
            {!!deliveries?.meta.total && (
              <Badge
                variant="destructive"
                className="text-xs ml-1 h-5 min-w-5 px-1.5"
              >
                {deliveries.meta.total}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pickup" className="mt-4 space-y-3">
          {pLoading ? (
            <TabLoading />
          ) : pError ? (
            <TabError message={DRIVER_COPY.pickupLoadError} />
          ) : !pickups?.data.length ? (
            <TabEmpty message={DRIVER_COPY.pickupEmptyState} />
          ) : (
            pickups.data.map((item) => (
              <PickupRequestCard
                key={item.id}
                item={item}
                hasActive={!!activeTask}
                isPending={acceptPickup.isPending}
                onAccept={() => acceptPickup.mutate(item)}
              />
            ))
          )}
          {(pickups?.meta.totalPages ?? 0) > 1 && (
            <TabPagination
              page={pickupPage}
              total={pickups!.meta.totalPages}
              onChange={setPickupPage}
            />
          )}
        </TabsContent>
        <TabsContent value="delivery" className="mt-4 space-y-3">
          {dLoading ? (
            <TabLoading />
          ) : dError ? (
            <TabError message={DRIVER_COPY.deliveryLoadError} />
          ) : !deliveries?.data.length ? (
            <TabEmpty message={DRIVER_COPY.deliveryEmptyState} />
          ) : (
            deliveries.data.map((item) => (
              <DeliveryRequestCard
                key={item.id}
                item={item}
                hasActive={!!activeTask}
                isPending={acceptDelivery.isPending}
                onAccept={() => acceptDelivery.mutate(item)}
              />
            ))
          )}
          {(deliveries?.meta.totalPages ?? 0) > 1 && (
            <TabPagination
              page={deliveryPage}
              total={deliveries!.meta.totalPages}
              onChange={setDeliveryPage}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusHero({ name }: { name: string }) {
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
            {DRIVER_COPY.dashboardDescription}
          </p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
          <Truck className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

function NextStopCard({ task }: { task: DriverActiveTask }) {
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
              {task.customerName ?? DRIVER_COPY.unavailable}
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

function PickupRequestCard({
  item,
  hasActive,
  isPending,
  onAccept,
}: {
  item: DriverPickupListItem;
  hasActive: boolean;
  isPending: boolean;
  onAccept: () => void;
}) {
  const phone = item.address.phone ?? item.customer.phone;
  const address = [item.address.label, item.address.street, item.address.city]
    .filter(Boolean)
    .join(', ');
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-3">
        <p className="font-bold text-foreground">
          {item.customer.name ?? DRIVER_COPY.unavailable}
        </p>
        {phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-foreground">{phone}</span>
          </div>
        )}
        <div className="flex items-start gap-2.5 text-sm">
          <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-foreground leading-tight pt-1">{address}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-muted-foreground">
            {formatDriverDateTime(item.scheduledAt)}
          </span>
        </div>
        {!hasActive && (
          <Button
            size="sm"
            className="w-full"
            onClick={onAccept}
            disabled={isPending}
          >
            {isPending ? DRIVER_COPY.accepting : DRIVER_COPY.acceptButton}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function DeliveryRequestCard({
  item,
  hasActive,
  isPending,
  onAccept,
}: {
  item: DeliveryListItem;
  hasActive: boolean;
  isPending: boolean;
  onAccept: () => void;
}) {
  const phone = item.deliveryAddress.phone ?? item.customer.phone;
  const address = [
    item.deliveryAddress.label,
    item.deliveryAddress.street,
    item.deliveryAddress.city,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-foreground">
            {item.customer.name ?? DRIVER_COPY.unavailable}
          </p>
          <Badge variant="outline" className="text-xs shrink-0">
            {item.orderId.slice(0, 8)}
          </Badge>
        </div>
        {phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-foreground">{phone}</span>
          </div>
        )}
        <div className="flex items-start gap-2.5 text-sm">
          <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-foreground leading-tight pt-1.5">
            {address}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-muted-foreground">
            {formatDriverDateTime(item.createdAt)}
          </span>
        </div>
        {!hasActive && (
          <Button
            size="sm"
            className="w-full"
            onClick={onAccept}
            disabled={isPending}
          >
            {isPending ? DRIVER_COPY.accepting : DRIVER_COPY.acceptButton}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function TabLoading() {
  return (
    <Card className="rounded-2xl border-border/60 mt-4">
      <CardContent className="py-10 text-center text-muted-foreground text-sm">
        Loading...
      </CardContent>
    </Card>
  );
}

function TabError({ message }: { message: string }) {
  return (
    <Card className="rounded-2xl border-border/60 mt-4">
      <CardContent className="py-10 text-center text-destructive text-sm">
        {message}
      </CardContent>
    </Card>
  );
}

function TabEmpty({ message }: { message: string }) {
  return (
    <Card className="rounded-2xl border-border/60 mt-4">
      <CardContent className="py-12 text-center text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}

function TabPagination({
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
        {DRIVER_COPY.paginationPrevious}
      </Button>
      <span>
        {DRIVER_COPY.paginationPagePrefix} {page} {DRIVER_COPY.paginationOf}{' '}
        {total}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        {DRIVER_COPY.paginationNext}
      </Button>
    </div>
  );
}
