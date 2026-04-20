import { useQuery } from '@tanstack/react-query';
import { getAvailableDeliveries } from '@/services/delivery';

export function useAvailableDeliveries(params: { page: number; limit: number }) {
  return useQuery({
    queryKey: ['driver', 'deliveries', params],
    queryFn: () => getAvailableDeliveries(params),
    staleTime: 0,
  });
}
