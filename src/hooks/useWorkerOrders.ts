import { useQuery } from '@tanstack/react-query';
import { getWorkerOrders } from '@/services/workerOrder';
import type { WorkerOrderListParams } from '@/types/worker-order';

export function useWorkerOrders(params: WorkerOrderListParams) {
  return useQuery({
    queryKey: ['worker-orders', params],
    queryFn: () => getWorkerOrders(params),
  });
}
