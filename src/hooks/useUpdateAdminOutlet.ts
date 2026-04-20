import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateOutlet } from '@/services/adminOutlet';
import type { OutletFormValues } from '@/types/outlet';

export const useUpdateAdminOutlet = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      outletId,
      payload,
    }: {
      outletId: string;
      payload: OutletFormValues;
    }) => updateOutlet(outletId, payload),
    onSuccess: (_, variables) => {
      toast.success('Outlet updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-outlets'] });
      queryClient.invalidateQueries({
        queryKey: ['admin-outlet', variables.outletId],
      });
      onSuccess();
    },
    onError: () => {
      toast.error('Failed to update outlet');
    },
  });
};
