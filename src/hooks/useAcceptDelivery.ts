import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { acceptDelivery } from '@/services/delivery';
import { DRIVER_UI_TEXT } from '@/utils/driver';
import { queryKeys } from '@/utils/queryKeys';
import type { DeliveryListItem } from '@/types/delivery';

export function useAcceptDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: DeliveryListItem) => acceptDelivery(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driverActiveTask() });
      queryClient.invalidateQueries({ queryKey: ['driver', 'deliveries'] });
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
