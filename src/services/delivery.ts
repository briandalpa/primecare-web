import { axiosInstance } from '@/lib/axiosInstance';
import type {
  PaginatedDeliveryListResponse,
  DeliveryAcceptResponse,
  DeliveryCompleteResponse,
  PaginatedDeliveryHistoryResponse,
  DriverOrderSummary,
  DriverActiveTask,
} from '@/types/delivery';

type ListParams = { page: number; limit: number; status: 'PENDING' };
type HistoryParams = { page: number; limit: number; fromDate?: string; toDate?: string };

export const getAvailableDeliveries = async (
  params: ListParams,
): Promise<PaginatedDeliveryListResponse> => {
  const res = await axiosInstance.get<PaginatedDeliveryListResponse>(
    '/api/v1/deliveries',
    { params },
  );
  return res.data;
};

export const acceptDelivery = async (id: string): Promise<DeliveryAcceptResponse> => {
  const res = await axiosInstance.patch<{ data: DeliveryAcceptResponse }>(
    `/api/v1/deliveries/${id}/accept`,
  );
  return res.data.data;
};

export const completeDelivery = async (id: string): Promise<DeliveryCompleteResponse> => {
  const res = await axiosInstance.patch<{ data: DeliveryCompleteResponse }>(
    `/api/v1/deliveries/${id}/complete`,
  );
  return res.data.data;
};

export const getDriverDeliveryOrder = async (deliveryId: string): Promise<DriverOrderSummary> => {
  const res = await axiosInstance.get<{ data: DriverOrderSummary }>(
    `/api/v1/deliveries/${deliveryId}/order`,
  );
  return res.data.data;
};

export const getDriverActiveTask = async (): Promise<DriverActiveTask | null> => {
  const res = await axiosInstance.get<{ data: DriverActiveTask | null }>('/api/v1/drivers/me/active-task');
  return res.data.data;
};

export const getDeliveryHistory = async (
  params: HistoryParams,
): Promise<PaginatedDeliveryHistoryResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined),
  );
  const res = await axiosInstance.get<PaginatedDeliveryHistoryResponse>(
    '/api/v1/deliveries/history',
    { params: cleanParams },
  );
  return res.data;
};
