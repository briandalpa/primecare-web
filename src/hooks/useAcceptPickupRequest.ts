import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { acceptPickupRequest } from '@/services/driverPickupRequest';
import { DRIVER_COPY, DRIVER_TASK_STORAGE_KEY } from '@/utils/driver';
import type { DriverActiveTask } from '@/types/delivery';

export function useAcceptPickupRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptPickupRequest,
    onSuccess: (data) => {
      const activeTask: DriverActiveTask = { type: 'pickup', id: data.id };
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
