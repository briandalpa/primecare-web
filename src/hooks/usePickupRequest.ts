import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPickupRequest } from '@/services/pickupRequest'
import type { PickupRequestPayload } from '@/types/pickupRequest'
import { queryKeys } from '@/utils/queryKeys'

export const useCreatePickupRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PickupRequestPayload) => createPickupRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerOrders() })
    },
  })
}
