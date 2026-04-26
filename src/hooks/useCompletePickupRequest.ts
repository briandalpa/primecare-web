import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { completePickupRequest } from '@/services/driverPickupRequest';
import { DRIVER_UI_TEXT } from '@/utils/driver';
import { queryKeys } from '@/utils/queryKeys';

export function useCompletePickupRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completePickupRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driverActiveTask() });
      queryClient.invalidateQueries({ queryKey: ['driver', 'pickups'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'pickup-history'] });
      toast.success(DRIVER_UI_TEXT.activeTaskCompleteSuccess);
    },
    onError: () => {
      toast.error(DRIVER_UI_TEXT.activeTaskCompleteError);
    },
  });
}
