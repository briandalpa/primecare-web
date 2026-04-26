import { axiosInstance } from '@/lib/axiosInstance';
import { isAxiosError } from 'axios';
import type { BypassRequest } from '@/types/bypassRequest';

type ApiResponse<T> = {
  data: T;
};

type MutationPayload = {
  id: string;
  password: string;
  problemDescription: string;
};

const getErrorMessage = (error: unknown) => {
  if (!isAxiosError(error)) return 'Failed to load data';
  const message = error.response?.data?.message;
  return typeof message === 'string' ? message : error.message;
};

export const getAdminBypassRequests = async (): Promise<BypassRequest[]> => {
  try {
    const res = await axiosInstance.get<ApiResponse<BypassRequest[]>>(
      '/api/v1/bypass-requests?status=PENDING'
    );

    if (!Array.isArray(res.data.data)) {
      throw new Error('Invalid response format');
    }

    return res.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const approveBypassRequest = async (
  payload: MutationPayload
): Promise<BypassRequest> => {
  const res = await axiosInstance.patch<ApiResponse<BypassRequest>>(
    `/api/v1/bypass-requests/${payload.id}/approve`,
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
    `/api/v1/bypass-requests/${payload.id}/reject`,
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
