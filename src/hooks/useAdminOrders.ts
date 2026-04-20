import { useQuery } from '@tanstack/react-query'
import type { AdminOrderParams } from '@/types/order'
import { getAdminOrders } from '@/services/adminOrder'

export const useAdminOrders = (params: AdminOrderParams) => {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => getAdminOrders(params),
  })
}
