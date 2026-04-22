import { useQuery } from '@tanstack/react-query';
import { getComplaint } from '@/services/complaint';

export const useComplaintDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => getComplaint(id!),
    enabled: !!id,
  });
};
