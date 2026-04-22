import { axiosInstance } from '@/lib/axiosInstance';
import { ComplaintStatus } from '@/types/enums';
import type {
  GetComplaintsParams,
  GetComplaintsResponse,
  GetComplaintResponse,
  CreateComplaintPayload,
} from '@/types/complaint';

export const getComplaints = async (params: GetComplaintsParams): Promise<GetComplaintsResponse> => {
  const res = await axiosInstance.get('/api/v1/complaints', { params });
  return res.data;
};

export const getComplaint = async (id: string): Promise<GetComplaintResponse> => {
  const res = await axiosInstance.get(`/api/v1/complaints/${id}`);
  return res.data;
};

export const createComplaint = async (payload: CreateComplaintPayload) => {
  const res = await axiosInstance.post('/api/v1/complaints', payload);
  return res.data;
};

export const updateComplaintStatus = async (id: string, status: ComplaintStatus) => {
  const res = await axiosInstance.patch(`/api/v1/complaints/${id}/status`, { status });
  return res.data;
};
