import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processWorkerOrder } from '@/services/workerOrder';
import type { WorkerOrderProcessPayload } from '@/types/worker-order';

type ProcessWorkerOrderInput = {
  id: string;
  payload: WorkerOrderProcessPayload;
};

export function useProcessWorkerOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: ProcessWorkerOrderInput) =>
      processWorkerOrder(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['worker-orders'] });
      queryClient.invalidateQueries({
        queryKey: ['worker-order-detail', variables.id],
      });
    },
  });
}
