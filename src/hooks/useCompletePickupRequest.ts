import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { completePickupRequest } from '@/services/driverPickupRequest';
import { DRIVER_COPY, DRIVER_TASK_STORAGE_KEY } from '@/utils/driver';

export function useCompletePickupRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completePickupRequest,
    onSuccess: () => {
      localStorage.removeItem(DRIVER_TASK_STORAGE_KEY);
      queryClient.invalidateQueries({ queryKey: ['driver', 'pickups'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'pickup-history'] });
      toast.success(DRIVER_COPY.activeTaskCompleteSuccess);
    },
    onError: () => {
      toast.error(DRIVER_COPY.activeTaskCompleteError);
    },
  });
}
