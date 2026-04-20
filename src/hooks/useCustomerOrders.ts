import { useQuery } from '@tanstack/react-query'
import { useSession } from '@/lib/auth-client'
import type { CustomerOrderParams } from '@/types/order'
import { getCustomerOrders } from '@/services/customerOrder'
import { queryKeys } from '@/utils/queryKeys'

export const useCustomerOrders = (params: CustomerOrderParams) => {
  const { data: session } = useSession()
  return useQuery({
    queryKey: [
      ...queryKeys.customerOrders(),
      params.page,
      params.limit,
      params.status,
      params.excludeCompleted,
      params.search,
      params.fromDate,
      params.toDate,
    ],
    queryFn: () => getCustomerOrders(params),
    enabled: !!session,
  })
}
