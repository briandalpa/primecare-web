import { axiosInstance } from '@/lib/axiosInstance';
import type {
  OutletDetailResponse,
  OutletFormValues,
  OutletListParams,
  OutletListResponse,
} from '@/types/outlet';

export const getOutlets = async (
  params: OutletListParams,
): Promise<OutletListResponse> => {
  const res = await axiosInstance.get('/api/v1/admin/outlets', { params });
  return res.data;
};

export const getOutletById = async (
  outletId: string,
): Promise<OutletDetailResponse> => {
  const res = await axiosInstance.get(`/api/v1/admin/outlets/${outletId}`);
  return res.data;
};

export const createOutlet = async (payload: OutletFormValues) => {
  const res = await axiosInstance.post('/api/v1/admin/outlets', payload);
  return res.data;
};

export const updateOutlet = async (
  outletId: string,
  payload: OutletFormValues,
) => {
  const res = await axiosInstance.patch(
    `/api/v1/admin/outlets/${outletId}`,
    payload,
  );
  return res.data;
};

export const deactivateOutlet = async (outletId: string) => {
  const res = await axiosInstance.delete(`/api/v1/admin/outlets/${outletId}`);
  return res.data;
};
