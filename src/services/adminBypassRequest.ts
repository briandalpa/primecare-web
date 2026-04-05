import { axiosInstance } from '@/lib/axiosInstance';
import type { BypassRequest } from '@/types/bypassRequest';

type ApiResponse<T> = {
  data: T;
};

export const getAdminBypassRequests = async (): Promise<BypassRequest[]> => {
  const res = await axiosInstance.get<ApiResponse<BypassRequest[]>>(
    '/api/v1/admin/bypass-requests'
  );

  return res.data.data;
};

export const approveBypassRequest = async (
  id: string,
  payload: { password: string; problemDescription: string }
): Promise<BypassRequest> => {
  const res = await axiosInstance.patch<ApiResponse<BypassRequest>>(
    `/api/v1/admin/bypass-requests/${id}/approve`,
    payload
  );

  return res.data.data;
};

export const rejectBypassRequest = async (
  id: string,
  payload: { password: string; problemDescription: string }
): Promise<BypassRequest> => {
  const res = await axiosInstance.patch<ApiResponse<BypassRequest>>(
    `/api/v1/admin/bypass-requests/${id}/reject`,
    payload
  );

  return res.data.data;
};