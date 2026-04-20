import { useQuery } from '@tanstack/react-query';
import { getDeliveryHistory } from '@/services/delivery';

type Params = { page: number; limit: number; fromDate?: string; toDate?: string };

export function useDeliveryHistory(params: Params) {
  return useQuery({
    queryKey: ['driver', 'delivery-history', params],
    queryFn: () => getDeliveryHistory(params),
    staleTime: 30_000,
  });
}
