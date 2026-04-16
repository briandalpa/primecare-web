import { axiosInstance } from '@/lib/axiosInstance';
import type {
  WorkerOrderListParams,
  WorkerOrderListResponse,
} from '@/types/worker-order';

const sanitizeParams = (params: WorkerOrderListParams = {}) => ({
  page: params.page ?? 1,
  limit: params.limit ?? 10,
  ...(params.status && params.status !== 'ALL' ? { status: params.status } : {}),
  ...(params.date ? { date: params.date } : {}),
});

export async function getWorkerOrders(
  params: WorkerOrderListParams = {},
): Promise<WorkerOrderListResponse> {
  const response = await axiosInstance.get<WorkerOrderListResponse>('/api/v1/worker/orders', {
    params: sanitizeParams(params),
  });

  return response.data;
}
