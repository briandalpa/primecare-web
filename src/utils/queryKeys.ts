export const queryKeys = {
  customerOrders: () => ['customer-orders'] as const,
  customerOrderDetail: (id: string) => ['customer-order-detail', id] as const,
} as const;
