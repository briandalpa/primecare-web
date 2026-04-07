import { useMutation } from '@tanstack/react-query'
import { createPickupRequest } from '@/services/pickupRequest'
import type { PickupRequestPayload } from '@/types/pickupRequest'

export const useCreatePickupRequest = () =>
  useMutation({
    mutationFn: (payload: PickupRequestPayload) => createPickupRequest(payload),
  })
