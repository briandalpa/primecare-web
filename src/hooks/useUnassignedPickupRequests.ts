import { useQuery } from '@tanstack/react-query';
import { getUnassignedPickupRequests } from '@/services/driverPickupRequest';

export function useUnassignedPickupRequests(params: { page: number; limit: number }) {
  return useQuery({
    queryKey: ['driver', 'pickups', params],
    queryFn: () => getUnassignedPickupRequests(params),
    staleTime: 0,
  });
}
