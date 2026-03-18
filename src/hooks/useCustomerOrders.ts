import { useQuery } from '@tanstack/react-query'
import type { CustomerOrderParams } from '@/types/order'
import { getCustomerOrders } from '@/services/customerOrder'

export const useCustomerOrders = (params: CustomerOrderParams) => {
  return useQuery({
    queryKey: ['customer-orders', params],
    queryFn: () => getCustomerOrders(params),
  })
}
