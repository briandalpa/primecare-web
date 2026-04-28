import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getComplaint } from '@/services/complaint';

export const useComplaintDetail = (id: string | undefined) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['complaint', session?.user?.id, id],
    queryFn: () => getComplaint(id!),
    enabled: !!session && !!id,
  });
};
