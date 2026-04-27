import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';
import { getDriverActiveTask } from '@/services/delivery';

export function useDriverActiveTask() {
  return useQuery({
    queryKey: queryKeys.driverActiveTask(),
    queryFn: getDriverActiveTask,
    staleTime: 30_000,
  });
}
