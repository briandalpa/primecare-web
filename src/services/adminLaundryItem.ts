import { axiosInstance } from '@/lib/axiosInstance'
import type { LaundryItem } from '@/types/order'

export const getLaundryItems = async (): Promise<{ data: LaundryItem[] }> => {
  const res = await axiosInstance.get('/admin/laundry-items')
  return res.data
}
