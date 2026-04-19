import { useQuery } from '@tanstack/react-query';
import { getOutlets } from '@/services/adminOutlet';
import type { OutletListParams } from '@/types/outlet';

export const useAdminOutlets = (params: OutletListParams) => {
  return useQuery({
    queryKey: ['admin-outlets', params],
    queryFn: () => getOutlets(params),
    staleTime: 30_000,
  });
};
