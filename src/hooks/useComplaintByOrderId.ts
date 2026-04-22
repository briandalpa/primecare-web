import { useQuery } from '@tanstack/react-query';
import { getComplaints } from '@/services/complaint';
import type { Complaint } from '@/types/complaint';

export const useComplaintByOrderId = (
  orderId: string,
): { complaint: Complaint | null; isPending: boolean } => {
  const { data, isPending } = useQuery({
    queryKey: ['complaint-by-order', orderId],
    queryFn: () => getComplaints({ orderId, limit: 1 }),
    enabled: !!orderId,
  });
  return { complaint: data?.data[0] ?? null, isPending };
};
