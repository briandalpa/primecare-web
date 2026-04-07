import { axiosInstance } from '@/lib/axiosInstance'
import type { PickupRequestPayload, PickupRequestResponse } from '@/types/pickupRequest'

export const createPickupRequest = async (
  payload: PickupRequestPayload,
): Promise<PickupRequestResponse> => {
  const res = await axiosInstance.post<{ data: PickupRequestResponse }>(
    '/api/v1/pickup-requests',
    payload,
  )
  return res.data.data
}
