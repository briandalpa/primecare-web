import { useMutation } from '@tanstack/react-query';
import { initiatePayment } from '@/services/payment';

export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: (orderId: string) => initiatePayment(orderId),
  });
};
