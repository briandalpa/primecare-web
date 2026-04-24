import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { acceptPickupRequest } from '@/services/driverPickupRequest';
import { DRIVER_COPY, DRIVER_TASK_STORAGE_KEY } from '@/utils/driver';
import type { DriverPickupListItem, DriverPickupTask } from '@/types/delivery';

export function useAcceptPickupRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: DriverPickupListItem) => acceptPickupRequest(item.id),
    onSuccess: (data, item) => {
      const activeTask: DriverPickupTask = {
        type: 'pickup',
        id: data.id,
        customerName: item.customer.name,
        customerPhone: item.address.phone ?? item.customer.phone,
        address: {
          label: item.address.label,
          street: item.address.street,
          city: item.address.city,
        },
      };
      localStorage.setItem(DRIVER_TASK_STORAGE_KEY, JSON.stringify(activeTask));
      queryClient.invalidateQueries({ queryKey: ['driver', 'pickups'] });
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
