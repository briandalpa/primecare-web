import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deactivateOutlet } from '@/services/adminOutlet';

export const useDeactivateAdminOutlet = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (outletId: string) => deactivateOutlet(outletId),
    onSuccess: () => {
      toast.success('Outlet deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-outlets'] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to deactivate outlet');
    },
  });
};
