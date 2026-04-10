import { axiosInstance } from '@/lib/axiosInstance';
import type { InitiatePaymentResponse } from '@/types/payment';

export const initiatePayment = async (
  orderId: string,
): Promise<{ data: InitiatePaymentResponse }> => {
  const res = await axiosInstance.post(`/api/v1/orders/${orderId}/payments`);
  return res.data;
};

export const verifyPayment = async (orderId: string): Promise<void> => {
  await axiosInstance.post(`/api/v1/orders/${orderId}/payments/verify`);
};
