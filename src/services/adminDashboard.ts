import { axiosInstance } from '@/lib/axiosInstance';
import type { DashboardStats } from '@/types/dashboard';

export const getDashboardStats = async (): Promise<{ data: DashboardStats }> => {
  const res = await axiosInstance.get('/admin/dashboard');
  return res.data;
};
