import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { completeDelivery } from '@/services/delivery';
import { DRIVER_COPY, DRIVER_TASK_STORAGE_KEY } from '@/utils/driver';

export function useCompleteDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeDelivery,
    onSuccess: () => {
      localStorage.removeItem(DRIVER_TASK_STORAGE_KEY);
      queryClient.invalidateQueries({ queryKey: ['driver', 'deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'delivery-history'] });
      toast.success(DRIVER_COPY.activeTaskCompleteSuccess);
    },
    onError: () => {
      toast.error(DRIVER_COPY.activeTaskCompleteError);
    },
  });
}
