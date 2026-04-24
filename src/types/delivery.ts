export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DeliveryStatus = 'PENDING' | 'DRIVER_ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export type CustomerInfo = {
  id: string;
  name: string | null;
  phone: string | null;
};

export type AddressInfo = {
  label: string;
  street: string;
  city: string;
  province: string;
  phone: string | null;
};

export type DeliveryListItem = {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  createdAt: string;
  customer: CustomerInfo;
  deliveryAddress: AddressInfo;
};

export type DeliveryAcceptResponse = {
  id: string;
  driverId: string;
  status: DeliveryStatus;
  orderStatus: string;
};

export type DeliveryCompleteResponse = {
  id: string;
  status: DeliveryStatus;
  orderStatus: string;
};

export type DeliveryHistoryItem = {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  deliveredAt: string | null;
  createdAt: string;
  customer: CustomerInfo;
  deliveryAddress: AddressInfo;
};

export type PaginatedDeliveryListResponse = {
  data: DeliveryListItem[];
  meta: PaginationMeta;
};

export type PaginatedDeliveryHistoryResponse = {
  data: DeliveryHistoryItem[];
  meta: PaginationMeta;
};

export type DriverPickupTask = {
  type: 'pickup';
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  address: DriverPickupAddressInfo;
};

export type DriverDeliveryTask = {
  type: 'delivery';
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  address: AddressInfo;
};

export type DriverActiveTask = DriverPickupTask | DriverDeliveryTask;

export type DriverPickupAddressInfo = {
  label: string;
  street: string;
  city: string;
};

export type DriverPickupCustomerInfo = {
  id: string;
  name: string | null;
  phone: string | null;
};

export type DriverPickupListItem = {
  id: string;
  customerId: string;
  addressId: string;
  outletId: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
  address: {
    label: string;
    street: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
    phone: string | null;
  };
  customer: DriverPickupCustomerInfo;
};

export type PaginatedDriverPickupResponse = {
  data: DriverPickupListItem[];
  meta: PaginationMeta;
};

export type PickupAcceptResponse = {
  id: string;
  driverId: string;
  status: string;
  orderStatus: string;
};

export type PickupCompleteResponse = {
  id: string;
  status: string;
  orderStatus: string;
};

export type PickupHistoryItem = {
  id: string;
  orderId: string | null;
  customerName: string | null;
  pickupAddress: DriverPickupAddressInfo;
  status: string;
  completedAt: string;
};

export type PaginatedPickupHistoryResponse = {
  data: PickupHistoryItem[];
  meta: PaginationMeta;
};

export type DriverOrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type DriverOrderSummary = {
  items: DriverOrderItem[];
  totalPrice: number;
  deliveryFee: number;
};
