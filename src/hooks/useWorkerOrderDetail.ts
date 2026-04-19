import { useQuery } from '@tanstack/react-query';
import { getWorkerOrderDetail } from '@/services/workerOrder';

export function useWorkerOrderDetail(id: string) {
  return useQuery({
    queryKey: ['worker-order-detail', id],
    queryFn: () => getWorkerOrderDetail(id),
    enabled: !!id,
  });
}
