import { axiosInstance } from '@/lib/axiosInstance';
import type {
  WorkerBypassRequestPayload,
  WorkerBypassRequestResponse,
  WorkerOrderDetailResponse,
  WorkerOrderListParams,
  WorkerOrderListResponse,
  WorkerOrderProcessPayload,
  WorkerOrderProcessResponse,
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

export async function getWorkerOrderDetail(
  id: string,
): Promise<WorkerOrderDetailResponse> {
  const response = await axiosInstance.get<WorkerOrderDetailResponse>(
    `/api/v1/worker/orders/${id}`,
  );

  return response.data;
}

export async function processWorkerOrder(
  id: string,
  payload: WorkerOrderProcessPayload,
): Promise<WorkerOrderProcessResponse> {
  const response = await axiosInstance.post<WorkerOrderProcessResponse>(
    `/api/v1/worker/orders/${id}/process`,
    payload,
  );

  return response.data;
}

export async function createWorkerBypassRequest(
  id: string,
  payload: WorkerBypassRequestPayload,
): Promise<WorkerBypassRequestResponse> {
  const response = await axiosInstance.post<WorkerBypassRequestResponse>(
    `/api/v1/worker/orders/${id}/bypass-request`,
    payload,
  );

  return response.data;
}
