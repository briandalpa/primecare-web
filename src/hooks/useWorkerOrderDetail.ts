import type { Query } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
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
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['worker-order-detail', session?.user?.id, id],
    queryFn: () => getWorkerOrderDetail(id),
    enabled: !!session && !!id,
    refetchInterval: options?.refetchInterval,
  });
}
