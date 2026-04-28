import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getWorkerOrders } from '@/services/workerOrder';
import type { WorkerOrderListParams } from '@/types/worker-order';

export function useWorkerOrders(params: WorkerOrderListParams) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['worker-orders', session?.user?.id, params],
    queryFn: () => getWorkerOrders(params),
    enabled: !!session,
  });
}
