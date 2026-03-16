import { useQuery } from '@tanstack/react-query'
import { getCustomerOrderDetail } from '@/services/customerOrder'

export const useCustomerOrderDetail = (id: string) => {
  return useQuery({
    queryKey: ['customer-order-detail', id],
    queryFn: () => getCustomerOrderDetail(id),
    enabled: !!id,
  })
}
