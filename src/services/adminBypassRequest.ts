import { axiosInstance } from '@/lib/axiosInstance';
import type { BypassRequest } from '@/types/bypassRequest';

type ApiResponse<T> = {
  data: T;
};

type MutationPayload = {
  id: string;
  password: string;
  problemDescription: string;
};

export const getAdminBypassRequests = async (): Promise<BypassRequest[]> => {
  const res = await axiosInstance.get<ApiResponse<BypassRequest[]>>(
    '/api/v1/admin/bypass-requests?status=PENDING'
  );

  if (!Array.isArray(res.data.data)) {
    throw new Error('Invalid response format');
  }

  return res.data.data;
};

export const approveBypassRequest = async (
  payload: MutationPayload
): Promise<BypassRequest> => {
  const res = await axiosInstance.patch<ApiResponse<BypassRequest>>(
    `/api/v1/admin/bypass-requests/${payload.id}/approve`,
    {
      password: payload.password,
      problemDescription: payload.problemDescription,
    }
  );

  if (!res.data.data) {
    throw new Error('Invalid response format');
  }

  return res.data.data;
};

export const rejectBypassRequest = async (
  payload: MutationPayload
): Promise<BypassRequest> => {
  const res = await axiosInstance.patch<ApiResponse<BypassRequest>>(
    `/api/v1/admin/bypass-requests/${payload.id}/reject`,
    {
      password: payload.password,
      problemDescription: payload.problemDescription,
    }
  );

  if (!res.data.data) {
    throw new Error('Invalid response format');
  }

  return res.data.data;
};