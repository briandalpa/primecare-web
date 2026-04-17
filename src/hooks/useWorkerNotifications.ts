import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { WorkerNotificationPayload } from '@/types/worker-order';
import { WORKER_NOTIFICATION_EVENT, isWorkerStation } from '@/utils/worker';

type UseWorkerNotificationsOptions = {
  enabled: boolean;
};

const parseWorkerNotification = (
  value: string,
): WorkerNotificationPayload | null => {
  const payload = JSON.parse(value) as Partial<WorkerNotificationPayload>;

  if (
    payload.event !== WORKER_NOTIFICATION_EVENT ||
    !payload.orderId ||
    !payload.outletId ||
    !payload.station ||
    !isWorkerStation(payload.station)
  ) {
    return null;
  }

  return {
    event: payload.event,
    orderId: payload.orderId,
    outletId: payload.outletId,
    station: payload.station,
    orderStatus: payload.orderStatus ?? '',
    occurredAt: payload.occurredAt ?? '',
  };
};

export function useWorkerNotifications({
  enabled,
}: UseWorkerNotificationsOptions) {
  const queryClient = useQueryClient();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    if (!import.meta.env.VITE_API_URL) return;

    const stream = new EventSource(
      `${import.meta.env.VITE_API_URL}/api/v1/worker/notifications/stream`,
      { withCredentials: true },
    );

    const handleArrival = (event: MessageEvent<string>) => {
      try {
        const payload = parseWorkerNotification(event.data);
        if (!payload) return;
        setNotificationCount((count) => count + 1);
        queryClient.invalidateQueries({ queryKey: ['worker-orders'] });
      } catch {
        return;
      }
    };

    stream.addEventListener(
      WORKER_NOTIFICATION_EVENT,
      handleArrival as EventListener,
    );

    return () => {
      stream.removeEventListener(
        WORKER_NOTIFICATION_EVENT,
        handleArrival as EventListener,
      );
      stream.close();
    };
  }, [enabled, queryClient]);

  return { notificationCount };
}
