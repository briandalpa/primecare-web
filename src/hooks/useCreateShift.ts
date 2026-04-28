import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
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
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || 'Failed to create shift');
    },
  });
};
