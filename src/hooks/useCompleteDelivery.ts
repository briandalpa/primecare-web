import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { completeDelivery } from '@/services/delivery';
import { DRIVER_COPY } from '@/utils/driver';
import { queryKeys } from '@/utils/queryKeys';

export function useCompleteDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driverActiveTask() });
      queryClient.invalidateQueries({ queryKey: ['driver', 'deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'delivery-history'] });
      toast.success(DRIVER_COPY.activeTaskCompleteSuccess);
    },
    onError: () => {
      toast.error(DRIVER_COPY.activeTaskCompleteError);
    },
  });
}
