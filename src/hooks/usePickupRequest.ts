import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPickupRequest, getMyPickupRequests } from '@/services/pickupRequest'
import type { PickupRequestPayload } from '@/types/pickupRequest'
import { queryKeys } from '@/utils/queryKeys'

export const useCreatePickupRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PickupRequestPayload) => createPickupRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerOrders() })
      queryClient.invalidateQueries({ queryKey: queryKeys.pickupRequests() })
    },
  })
}

export const usePickupRequests = () =>
  useQuery({
    queryKey: queryKeys.pickupRequests(),
    queryFn: getMyPickupRequests,
  })
