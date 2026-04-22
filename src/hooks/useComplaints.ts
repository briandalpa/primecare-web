import { useQuery } from '@tanstack/react-query';
import { getComplaints } from '@/services/complaint';
import type { GetComplaintsParams } from '@/types/complaint';

export const useComplaints = (params: GetComplaintsParams) => {
  return useQuery({
    queryKey: ['complaints', params],
    queryFn: () => getComplaints(params),
  });
};
