import { axiosInstance } from '@/lib/axiosInstance'
import type { PaginatedResponse, CustomerOrder, CustomerOrderDetail, CustomerOrderParams } from '@/types/order'

export const getCustomerOrders = async (
  params: CustomerOrderParams = {},
): Promise<PaginatedResponse<CustomerOrder>> => {
  const res = await axiosInstance.get('/orders', { params })
  return res.data
}

export const getCustomerOrderDetail = async (
  id: string,
): Promise<{ data: CustomerOrderDetail }> => {
  const res = await axiosInstance.get(`/orders/${id}`)
  return res.data
}

export const confirmOrderReceipt = async (id: string) => {
  const res = await axiosInstance.post(`/orders/${id}/confirm`)
  return res.data
}
