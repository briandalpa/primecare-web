import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateComplaintStatus } from '@/services/complaint';
import { ComplaintStatus } from '@/types/enums';
import { COMPLAINT_STATUS_LABEL } from '@/utils/complaint';

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ComplaintStatus }) =>
      updateComplaintStatus(id, status),
    onSuccess: (_, { status }) => {
      toast.success(`Complaint marked as ${COMPLAINT_STATUS_LABEL[status]}`);
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
    },
    onError: () => {
      toast.error('Update failed');
    },
  });
};
