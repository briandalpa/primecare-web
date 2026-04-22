import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createComplaint } from '@/services/complaint';

export const useCreateComplaint = (onSuccess?: (id: string) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComplaint,
    onSuccess: (data) => {
      toast.success('Complaint submitted', { description: "We'll review it shortly." });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint-by-order'] });
      onSuccess?.(data.data.id);
    },
    onError: () => {
      toast.error('Could not file complaint');
    },
  });
};
