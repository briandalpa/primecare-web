import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getMyProfile } from '@/services/user';
import type { UserRole } from '@/utils/auth';

export function useCurrentUser() {
  const { data: session, isPending: sessionPending } = useSession();

  // better-auth session does not carry role — role is on the Staff model, not User.
  // We must fetch GET /api/v1/users/me after session loads to resolve effectiveRole.
  const query = useQuery({
    queryKey: ['me', session?.user?.id],
    queryFn: getMyProfile,
    enabled: !!session,          // don't fetch if unauthenticated
    staleTime: 5 * 60 * 1000,   // treat profile as fresh for 5 min; re-fetch on nav is fine
  });

  // Users without a Staff record are plain customers.
  const effectiveRole: UserRole = query.data?.staff?.role ?? 'CUSTOMER';

  return {
    profile: query.data,
    effectiveRole,
    // isPending is true if either the session or the subsequent profile fetch is in-flight.
    isPending: sessionPending || (!!session && query.isPending),
    isError: query.isError,
  };
}
