import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getAdminPickupRequests } from '@/services/adminPickupRequest';

export const useAdminPickupRequests = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['admin-pickup-requests', session?.user?.id],
    queryFn: getAdminPickupRequests,
    enabled: !!session?.user?.id,
  });
};
