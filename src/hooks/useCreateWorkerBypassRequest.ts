import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkerBypassRequest } from '@/services/workerOrder';
import type { WorkerBypassRequestPayload } from '@/types/worker-order';

type CreateWorkerBypassRequestInput = {
  id: string;
  payload: WorkerBypassRequestPayload;
};

export function useCreateWorkerBypassRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: CreateWorkerBypassRequestInput) =>
      createWorkerBypassRequest(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['worker-orders'] });
      queryClient.invalidateQueries({
        queryKey: ['worker-order-detail', variables.id],
      });
    },
  });
}
