export type WorkerOrderStatus =
  | 'IN_PROGRESS'
  | 'BYPASS_REQUESTED'
  | 'COMPLETED';

export type WorkerStation = 'WASHING' | 'IRONING' | 'PACKING';

export type WorkerNotificationEvent = 'worker-order-arrived';

export type WorkerOrder = {
  id: string;
  orderId: string;
  station: WorkerStation;
  status: WorkerOrderStatus;
  totalItems: number;
  updatedAt: string;
  createdAt?: string;
  customerName?: string | null;
  outletName?: string | null;
};

export type WorkerOrderMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type WorkerOrderListResponse = {
  status: string;
  message: string;
  data: WorkerOrder[];
  meta: WorkerOrderMeta;
};

export type WorkerOrderListParams = {
  page?: number;
  limit?: number;
  status?: WorkerOrderStatus | 'ALL';
  date?: string;
};

export type WorkerNotificationPayload = {
  event: WorkerNotificationEvent;
  orderId: string;
  outletId: string;
  station: WorkerStation;
  orderStatus: string;
  occurredAt: string;
};
