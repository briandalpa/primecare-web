import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { acceptDelivery } from '@/services/delivery';
import { DRIVER_COPY, DRIVER_TASK_STORAGE_KEY } from '@/utils/driver';
import type { DeliveryListItem, DriverDeliveryTask } from '@/types/delivery';

export function useAcceptDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: DeliveryListItem) => acceptDelivery(item.id),
    onSuccess: (data, item) => {
      const activeTask: DriverDeliveryTask = {
        type: 'delivery',
        id: data.id,
        customerName: item.customer.name,
        customerPhone: item.customer.phone,
        address: item.deliveryAddress,
      };
      localStorage.setItem(DRIVER_TASK_STORAGE_KEY, JSON.stringify(activeTask));
      queryClient.invalidateQueries({ queryKey: ['driver', 'deliveries'] });
      toast.success(DRIVER_COPY.acceptSuccess);
    },
    onError: (error: { response?: { status: number } }) => {
      if (error.response?.status === 409) {
        toast.error(DRIVER_COPY.acceptConflictError);
      } else {
        toast.error(DRIVER_COPY.acceptError);
      }
    },
  });
}
