import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/adminDashboard';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getDashboardStats,
  });
}
