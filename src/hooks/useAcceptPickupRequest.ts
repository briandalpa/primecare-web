import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { acceptPickupRequest } from '@/services/driverPickupRequest';
import { DRIVER_UI_TEXT } from '@/utils/driver';
import { queryKeys } from '@/utils/queryKeys';
import type { DriverPickupListItem } from '@/types/delivery';

export function useAcceptPickupRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: DriverPickupListItem) => acceptPickupRequest(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driverActiveTask() });
      queryClient.invalidateQueries({ queryKey: ['driver', 'pickups'] });
      toast.success(DRIVER_UI_TEXT.acceptSuccess);
    },
    onError: (error: { response?: { status: number } }) => {
      if (error.response?.status === 409) {
        toast.error(DRIVER_UI_TEXT.acceptConflictError);
      } else {
        toast.error(DRIVER_UI_TEXT.acceptError);
      }
    },
  });
}
