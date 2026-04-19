import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { confirmOrderReceipt } from '@/services/customerOrder';
import { queryKeys } from '@/utils/queryKeys';

export function useConfirmOrderReceipt(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => confirmOrderReceipt(id),
    onSuccess: () => {
      toast.success('Order confirmed!');
      queryClient.invalidateQueries({ queryKey: queryKeys.customerOrderDetail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.customerOrders() });
    },
    onError: () => {
      toast.error('Failed to confirm order');
    },
  });
}
