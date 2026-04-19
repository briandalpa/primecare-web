import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createShift } from '@/services/shift';
import type { CreateShiftValues } from '@/types/shift';

export const useCreateShift = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShiftValues) => createShift(payload),
    onSuccess: () => {
      toast.success('Shift created successfully');
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create shift');
    },
  });
};
