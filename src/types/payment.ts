export type InitiatePaymentResponse = {
  paymentId: string;
  orderId: string;
  amount: number;
  snapToken: string;
  redirectUrl: string;
};
