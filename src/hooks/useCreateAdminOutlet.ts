import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createOutlet } from '@/services/adminOutlet';
import type { OutletFormValues } from '@/types/outlet';

export const useCreateAdminOutlet = (onSuccess: (id?: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OutletFormValues) => createOutlet(payload),
    onSuccess: (response) => {
      toast.success('Outlet created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-outlets'] });
      onSuccess(response?.data?.id);
    },
    onError: () => {
      toast.error('Failed to create outlet');
    },
  });
};
