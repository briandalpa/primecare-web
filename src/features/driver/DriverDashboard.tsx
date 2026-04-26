import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/lib/auth-client';
import { useUnassignedPickupRequests } from '@/hooks/useUnassignedPickupRequests';
import { useAvailableDeliveries } from '@/hooks/useAvailableDeliveries';
import { useAcceptPickupRequest } from '@/hooks/useAcceptPickupRequest';
import { useAcceptDelivery } from '@/hooks/useAcceptDelivery';
import { useDriverActiveTask } from '@/hooks/useDriverActiveTask';
import { DRIVER_UI_TEXT } from '@/utils/driver';
import {
  StatusHero,
  NextStopCard,
  TabLoading,
  TabError,
  TabEmpty,
  TabPagination,
} from './DriverDashboardUtils';
import { PickupRequestCard, DeliveryRequestCard } from './DriverDashboardCards';

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
            {DRIVER_UI_TEXT.pickupTabLabel}
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
            {DRIVER_UI_TEXT.deliveryTabLabel}
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
            <TabError message={DRIVER_UI_TEXT.pickupLoadError} />
          ) : !pickups?.data.length ? (
            <TabEmpty message={DRIVER_UI_TEXT.pickupEmptyState} />
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
            <TabError message={DRIVER_UI_TEXT.deliveryLoadError} />
          ) : !deliveries?.data.length ? (
            <TabEmpty message={DRIVER_UI_TEXT.deliveryEmptyState} />
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
