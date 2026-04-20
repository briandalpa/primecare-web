import { useState } from 'react';
import { Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompletePickupRequest } from '@/hooks/useCompletePickupRequest';
import { useCompleteDelivery } from '@/hooks/useCompleteDelivery';
import { DRIVER_COPY, DRIVER_TASK_STORAGE_KEY } from '@/utils/driver';
import type { DriverActiveTask } from '@/types/delivery';

function readActiveTask(): DriverActiveTask | null {
  const stored = localStorage.getItem(DRIVER_TASK_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as DriverActiveTask;
  } catch {
    localStorage.removeItem(DRIVER_TASK_STORAGE_KEY);
    return null;
  }
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
      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-mono truncate">{activeTask.id}</p>
        <Button size="sm" disabled={isPending} onClick={handleComplete}>
          {isPending ? DRIVER_COPY.activeTaskCompleting : DRIVER_COPY.activeTaskCompleteButton}
        </Button>
      </CardContent>
    </Card>
  );
}
