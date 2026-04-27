import { useQuery } from '@tanstack/react-query';
import { getDriverDeliveryOrder } from '@/services/delivery';

export function useDriverDeliveryOrder(deliveryId: string | undefined) {
  return useQuery({
    queryKey: ['driver-delivery-order', deliveryId],
    queryFn: () => getDriverDeliveryOrder(deliveryId!),
    enabled: !!deliveryId,
  });
}
