import type { ComplaintStatus } from '@/types/enums';

export type Complaint = {
  id: string;
  orderId: string;
  customerId?: string;
  customerName?: string;
  outletName?: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
};

export type GetComplaintsParams = {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
  outletId?: string;
  orderId?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export type GetComplaintsResponse = {
  status: string;
  message: string;
  data: Complaint[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type GetComplaintResponse = {
  status: string;
  message: string;
  data: Complaint;
};

export type CreateComplaintPayload = {
  orderId: string;
  description: string;
};
