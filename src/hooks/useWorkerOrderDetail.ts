import type { Query } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getWorkerOrderDetail } from '@/services/workerOrder';
import type { WorkerOrderDetailResponse } from '@/types/worker-order';

type UseWorkerOrderDetailOptions = {
  refetchInterval?:
    | number
    | false
    | ((
        query: Query<WorkerOrderDetailResponse, Error>,
      ) => number | false | undefined);
};

export function useWorkerOrderDetail(
  id: string,
  options?: UseWorkerOrderDetailOptions,
) {
  return useQuery({
    queryKey: ['worker-order-detail', id],
    queryFn: () => getWorkerOrderDetail(id),
    enabled: !!id,
    refetchInterval: options?.refetchInterval,
  });
}
