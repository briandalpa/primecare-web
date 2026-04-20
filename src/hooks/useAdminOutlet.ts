import { useQuery } from '@tanstack/react-query';
import { getOutletById } from '@/services/adminOutlet';

export const useAdminOutlet = (outletId?: string) => {
  return useQuery({
    queryKey: ['admin-outlet', outletId],
    queryFn: () => getOutletById(outletId!),
    enabled: !!outletId,
    staleTime: 30_000,
  });
};
