import { axiosInstance } from '@/lib/axiosInstance';
import type { LaundryItemListResponse } from '@/types/laundry-item';

export async function getLaundryItems(): Promise<LaundryItemListResponse> {
  const response = await axiosInstance.get<LaundryItemListResponse>(
    '/api/v1/laundry-items',
  );

  return response.data;
}
