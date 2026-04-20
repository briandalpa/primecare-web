import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { endShift } from '@/services/shift';

export const useEndShift = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shiftId: string) => endShift(shiftId),
    onSuccess: () => {
      toast.success('Shift ended successfully');
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to end shift');
    },
  });
};
