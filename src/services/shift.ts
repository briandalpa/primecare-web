import { axiosInstance } from '@/lib/axiosInstance';
import type {
  CreateShiftValues,
  ShiftListParams,
  ShiftListResponse,
} from '@/types/shift';

export const getShifts = async (
  params: ShiftListParams,
): Promise<ShiftListResponse> => {
  const res = await axiosInstance.get('/api/v1/shifts', { params });
  return res.data;
};

export const createShift = async (payload: CreateShiftValues) => {
  const res = await axiosInstance.post('/api/v1/shifts', payload);
  return res.data;
};

export const endShift = async (shiftId: string) => {
  const res = await axiosInstance.patch(`/api/v1/shifts/${shiftId}/end`);
  return res.data;
};
