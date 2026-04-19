import { useQuery } from '@tanstack/react-query';
import { getWorkerHistory } from '@/services/workerOrder';
import type { WorkerHistoryParams } from '@/types/worker-order';

export function useWorkerHistory(params: WorkerHistoryParams) {
  return useQuery({
    queryKey: ['worker-history', params],
    queryFn: () => getWorkerHistory(params),
  });
}
