import { axiosInstance } from '@/lib/axiosInstance'
import type { PaginatedResponse } from '@/types/order'
import type { CustomerPickupRequest, PickupRequestPayload, PickupRequestResponse } from '@/types/pickupRequest'

export const createPickupRequest = async (
  payload: PickupRequestPayload,
): Promise<PickupRequestResponse> => {
  const res = await axiosInstance.post<{ data: PickupRequestResponse }>(
    '/api/v1/pickup-requests',
    payload,
  )
  return res.data.data
}

export const getMyPickupRequests = async (): Promise<PaginatedResponse<CustomerPickupRequest>> => {
  const res = await axiosInstance.get<PaginatedResponse<CustomerPickupRequest>>(
    '/api/v1/pickup-requests/my',
    { params: { page: 1, limit: 10 } },
  )
  return res.data
}
