import { useState } from 'react';
import { Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompletePickupRequest } from '@/hooks/useCompletePickupRequest';
import { useCompleteDelivery } from '@/hooks/useCompleteDelivery';
import { DRIVER_COPY, DRIVER_TASK_STORAGE_KEY } from '@/utils/driver';
import type { DriverActiveTask, DriverDeliveryTask, DriverPickupTask } from '@/types/delivery';

function readActiveTask(): DriverActiveTask | null {
  const stored = localStorage.getItem(DRIVER_TASK_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null || !('type' in parsed)) {
      localStorage.removeItem(DRIVER_TASK_STORAGE_KEY);
      return null;
    }
    const p = parsed as Record<string, unknown>;
    if (p.type === 'pickup' && typeof p.id === 'string') {
      return p as DriverPickupTask;
    }
    if (p.type === 'delivery' && typeof p.id === 'string' && typeof p.address === 'object') {
      return p as DriverDeliveryTask;
    }
    localStorage.removeItem(DRIVER_TASK_STORAGE_KEY);
    return null;
  } catch {
    localStorage.removeItem(DRIVER_TASK_STORAGE_KEY);
    return null;
  }
}

function CustomerBlock({ task }: { task: DriverDeliveryTask }) {
  return (
    <div className="pb-3 border-b">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
        {DRIVER_COPY.customerLabel}
      </p>
      <p className="text-sm font-medium">{task.customerName ?? DRIVER_COPY.unavailable}</p>
      {task.customerPhone && (
        <p className="text-xs text-muted-foreground">{task.customerPhone}</p>
      )}
    </div>
  );
}

function AddressBlock({ task }: { task: DriverDeliveryTask }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
        {DRIVER_COPY.addressLabel}
      </p>
      <p className="text-sm">{task.address.label} — {task.address.street}</p>
      <p className="text-xs text-muted-foreground">
        {task.address.city}, {task.address.province}
      </p>
    </div>
  );
}

export function DriverActiveTaskCard() {
  const [activeTask, setActiveTask] = useState<DriverActiveTask | null>(readActiveTask);

  const completePickup = useCompletePickupRequest();
  const completeDelivery = useCompleteDelivery();

  if (!activeTask) return null;

  const isPickup = activeTask.type === 'pickup';
  const isPending = completePickup.isPending || completeDelivery.isPending;

  const handleComplete = () => {
    if (isPickup) {
      completePickup.mutate(activeTask.id, {
        onSuccess: () => setActiveTask(null),
      });
    } else {
      completeDelivery.mutate(activeTask.id, {
        onSuccess: () => setActiveTask(null),
      });
    }
  };

  return (
    <Card className="border-primary/40 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-primary">
          {isPickup ? <Package className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
          {DRIVER_COPY.activeTaskTitle} —{' '}
          {isPickup ? DRIVER_COPY.activeTaskPickupLabel : DRIVER_COPY.activeTaskDeliveryLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPickup ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-mono truncate">{activeTask.id}</p>
            <Button size="sm" disabled={isPending} onClick={handleComplete}>
              {isPending ? DRIVER_COPY.activeTaskCompleting : DRIVER_COPY.activeTaskCompleteButton}
            </Button>
          </div>
        ) : (
          <>
            <CustomerBlock task={activeTask} />
            <AddressBlock task={activeTask} />
            <Button className="w-full" size="sm" disabled={isPending} onClick={handleComplete}>
              {isPending ? DRIVER_COPY.activeTaskCompleting : DRIVER_COPY.activeTaskCompleteButton}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
