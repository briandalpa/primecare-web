import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getComplaints } from '@/services/complaint';
import type { GetComplaintsParams } from '@/types/complaint';

export const useComplaints = (params: GetComplaintsParams) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['complaints', session?.user?.id, params],
    queryFn: () => getComplaints(params),
    enabled: !!session,
  });
};
