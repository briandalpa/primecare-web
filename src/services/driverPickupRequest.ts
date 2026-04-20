import { axiosInstance } from '@/lib/axiosInstance';
import type {
  PaginatedDriverPickupResponse,
  PickupAcceptResponse,
  PickupCompleteResponse,
  PaginatedPickupHistoryResponse,
} from '@/types/delivery';

type ListParams = { page: number; limit: number };
type HistoryParams = { page: number; limit: number; fromDate?: string; toDate?: string };

export const getUnassignedPickupRequests = async (
  params: ListParams,
): Promise<PaginatedDriverPickupResponse> => {
  const res = await axiosInstance.get<PaginatedDriverPickupResponse>(
    '/api/v1/pickup-requests',
    { params },
  );
  return res.data;
};

export const acceptPickupRequest = async (id: string): Promise<PickupAcceptResponse> => {
  const res = await axiosInstance.patch<{ data: PickupAcceptResponse }>(
    `/api/v1/pickup-requests/${id}`,
  );
  return res.data.data;
};

export const completePickupRequest = async (id: string): Promise<PickupCompleteResponse> => {
  const res = await axiosInstance.patch<{ data: PickupCompleteResponse }>(
    `/api/v1/pickup-requests/${id}/complete`,
  );
  return res.data.data;
};

export const getPickupHistory = async (
  params: HistoryParams,
): Promise<PaginatedPickupHistoryResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined),
  );
  const res = await axiosInstance.get<PaginatedPickupHistoryResponse>(
    '/api/v1/pickup-requests/history',
    { params: cleanParams },
  );
  return res.data;
};
