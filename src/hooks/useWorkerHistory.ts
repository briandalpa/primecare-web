import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getWorkerHistory } from '@/services/workerOrder';
import type { WorkerHistoryParams } from '@/types/worker-order';

export function useWorkerHistory(params: WorkerHistoryParams) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['worker-history', session?.user?.id, params],
    queryFn: () => getWorkerHistory(params),
    enabled: !!session,
  });
}
