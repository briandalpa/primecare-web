import { axiosInstance } from '@/lib/axiosInstance'
import type { PaginatedResponse, CustomerOrder, CustomerOrderDetail, CustomerOrderParams } from '@/types/order'

export const getCustomerOrders = async (
  params: CustomerOrderParams = {},
): Promise<PaginatedResponse<CustomerOrder>> => {
  const res = await axiosInstance.get('/api/v1/orders', { params })
  return res.data
}

export const getCustomerOrderDetail = async (
  id: string,
): Promise<{ data: CustomerOrderDetail }> => {
  const res = await axiosInstance.get(`/api/v1/orders/${id}`)
  return res.data
}

export const confirmOrderReceipt = async (id: string) => {
  const res = await axiosInstance.patch(`/api/v1/orders/${id}/confirm`)
  return res.data
}
