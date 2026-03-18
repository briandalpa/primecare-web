import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getMyProfile } from '@/services/user';
import type { UserRole } from '@/utils/auth';

export function useCurrentUser() {
  const { data: session, isPending: sessionPending } = useSession();

  const query = useQuery({
    queryKey: ['me', session?.user?.id],
    queryFn: getMyProfile,
    enabled: !!session,
    staleTime: 5 * 60 * 1000,
  });

  const effectiveRole: UserRole = query.data?.staff?.role ?? 'CUSTOMER';

  return {
    profile: query.data,
    effectiveRole,
    isPending: sessionPending || (!!session && query.isPending),
    isError: query.isError,
  };
}
