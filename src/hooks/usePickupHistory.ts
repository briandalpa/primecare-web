import { useQuery } from '@tanstack/react-query';
import { getPickupHistory } from '@/services/driverPickupRequest';

type Params = { page: number; limit: number; fromDate?: string; toDate?: string };

export function usePickupHistory(params: Params) {
  return useQuery({
    queryKey: ['driver', 'pickup-history', params],
    queryFn: () => getPickupHistory(params),
    staleTime: 30_000,
  });
}
