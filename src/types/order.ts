import { OrderStatus, PaymentStatus } from '@/types/enums';

export type AdminOrder = {
  id: string;
  totalWeightKg: number;
  pricePerKg: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
  outlet: { id: string; name: string };
  pickupRequest: {
    id: string;
    customerId: string;
    status: string;
    customerUser?: { name: string | null; email: string };
  };
};

export type AdminOrderDetail = AdminOrder & {
  items: OrderItem[];
  stationRecords: StationRecord[];
};

export type OrderItem = {
  id: string;
  quantity: number;
  laundryItem: { id: string; name: string; slug: string };
};

export type StationRecord = {
  id: string;
  station: 'WASHING' | 'IRONING' | 'PACKING';
  status: 'IN_PROGRESS' | 'BYPASS_REQUESTED' | 'COMPLETED';
  completedAt: string | null;
  createdAt: string;
  staff: { user: { name: string | null } };
  stationItems: { laundryItemId: string; quantity: number }[];
  bypassRequests: {
    id: string;
    status: string;
    problemDescription: string | null;
  }[];
};

export type PickupRequest = {
  id: string;
  status: string;
  scheduledAt: string;
  customerUser?: { name: string | null; email: string };
  outlet?: { id: string; name: string };
  address?: { label: string; street: string; city: string };
};

export type CreateOrderPayload = {
  pickupRequestId: string;
  pricePerKg: number;
  totalWeightKg: number;
  items: { laundryItemId: string; quantity: number }[];
};

export type LaundryItem = {
  id: string;
  name: string;
  slug: string;
};

export type CustomerOrder = {
  id: string;
  outletName: string;
  customerName: string;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
};

export type CustomerOrderItem = {
  id: string;
  laundryItemId: string;
  itemName: string;
  quantity: number;
};

export type CustomerOrderDetail = {
  id: string;
  outletId: string;
  outletName: string;
  customerName: string;
  totalWeightKg: number;
  pricePerKg: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: CustomerOrderItem[];
  stationRecords: CustomerStationRecord[];
  payment: {
    id: string;
    amount: number;
    gateway: string;
    status: PaymentStatus;
    paidAt: string | null;
  } | null;
  delivery: {
    id: string;
    status: string;
    deliveredAt: string | null;
    createdAt: string;
  } | null;
};

export type CustomerStationRecord = {
  id: string;
  station: 'WASHING' | 'IRONING' | 'PACKING';
  workerName: string;
  status: 'IN_PROGRESS' | 'BYPASS_REQUESTED' | 'COMPLETED';
  completedAt: string | null;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  status: string;
  message: string;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type CustomerOrderParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  excludeCompleted?: boolean;
  search?: string;
  fromDate?: string;
  toDate?: string;
};

export type AdminOrderParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  outletId?: string;
  sortBy?: string;
  order?: string;
};
