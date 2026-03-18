import { axiosInstance } from '@/lib/axiosInstance'
import type { AdminOrderDetail } from '@/types/order'

export const getAdminOrderDetail = async (id: string): Promise<{ data: AdminOrderDetail }> => {
  const res = await axiosInstance.get(`/admin/orders/${id}`)
  return res.data
}
