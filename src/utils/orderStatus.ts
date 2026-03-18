import { OrderStatus } from '@/types/enums';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.WAITING_FOR_PICKUP_DRIVER]: 'Waiting for Driver Pickup',
  [OrderStatus.LAUNDRY_EN_ROUTE_TO_OUTLET]: 'Driver Picking Up Laundry',
  [OrderStatus.LAUNDRY_ARRIVED_AT_OUTLET]: 'Laundry Arrived at Outlet',
  [OrderStatus.LAUNDRY_BEING_WASHED]: 'Being Washed',
  [OrderStatus.LAUNDRY_BEING_IRONED]: 'Being Ironed',
  [OrderStatus.LAUNDRY_BEING_PACKED]: 'Being Packed',
  [OrderStatus.WAITING_FOR_PAYMENT]: 'Waiting for Payment',
  [OrderStatus.LAUNDRY_READY_FOR_DELIVERY]: 'Ready for Delivery',
  [OrderStatus.LAUNDRY_OUT_FOR_DELIVERY]: 'Out for Delivery',
  [OrderStatus.LAUNDRY_DELIVERED_TO_CUSTOMER]: 'Delivered',
  [OrderStatus.COMPLETED]: 'Completed',
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  [OrderStatus.WAITING_FOR_PICKUP_DRIVER]: 'bg-amber-100 text-amber-700 border-amber-200',
  [OrderStatus.LAUNDRY_EN_ROUTE_TO_OUTLET]: 'bg-blue-100 text-blue-700 border-blue-200',
  [OrderStatus.LAUNDRY_ARRIVED_AT_OUTLET]: 'bg-blue-100 text-blue-700 border-blue-200',
  [OrderStatus.LAUNDRY_BEING_WASHED]: 'bg-sky-100 text-sky-700 border-sky-200',
  [OrderStatus.LAUNDRY_BEING_IRONED]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  [OrderStatus.LAUNDRY_BEING_PACKED]: 'bg-violet-100 text-violet-700 border-violet-200',
  [OrderStatus.WAITING_FOR_PAYMENT]: 'bg-red-100 text-red-700 border-red-200',
  [OrderStatus.LAUNDRY_READY_FOR_DELIVERY]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [OrderStatus.LAUNDRY_OUT_FOR_DELIVERY]: 'bg-teal-100 text-teal-700 border-teal-200',
  [OrderStatus.LAUNDRY_DELIVERED_TO_CUSTOMER]: 'bg-green-100 text-green-700 border-green-200',
  [OrderStatus.COMPLETED]: 'bg-gray-100 text-gray-700 border-gray-200',
}

export const PAYMENT_BADGE: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700 border-green-200',
  UNPAID: 'bg-amber-100 text-amber-700 border-amber-200',
  FAILED: 'bg-red-100 text-red-700 border-red-200',
  PENDING: 'bg-blue-100 text-blue-700 border-blue-200',
  EXPIRED: 'bg-muted text-muted-foreground border-border',
};

const STATUS_ORDER = Object.values(OrderStatus)

export function getStatusSteps(current: OrderStatus) {
  const currentIndex = STATUS_ORDER.indexOf(current)
  return STATUS_ORDER.map((status, i) => ({
    status,
    label: ORDER_STATUS_LABEL[status],
    completed: i < currentIndex,
    active: i === currentIndex,
  }))
}
