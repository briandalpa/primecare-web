import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getComplaints } from '@/services/complaint';
import type { Complaint } from '@/types/complaint';

export const useComplaintByOrderId = (
  orderId: string,
): { complaint: Complaint | null; isPending: boolean } => {
  const { data: session } = useSession();
  const { data, isPending } = useQuery({
    queryKey: ['complaint-by-order', session?.user?.id, orderId],
    queryFn: () => getComplaints({ orderId, limit: 1 }),
    enabled: !!session && !!orderId,
  });
  return { complaint: data?.data[0] ?? null, isPending };
};
