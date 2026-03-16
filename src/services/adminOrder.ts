import { axiosInstance } from '@/lib/axiosInstance'
import type { CreateOrderPayload, PaginatedResponse, AdminOrder, AdminOrderParams } from '@/types/order'

export const getAdminOrders = async (
  params: AdminOrderParams = {},
): Promise<PaginatedResponse<AdminOrder>> => {
  const res = await axiosInstance.get('/admin/orders', { params })
  return res.data
}

export const createAdminOrder = async (data: CreateOrderPayload) => {
  const res = await axiosInstance.post('/admin/orders', data)
  return res.data
}
