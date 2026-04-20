export {};

interface SnapCallbackResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
}

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: SnapCallbackResult) => void;
          onPending?: (result: SnapCallbackResult) => void;
          onError?: (result: SnapCallbackResult) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}
