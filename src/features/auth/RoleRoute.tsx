import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { UserRole } from "@/utils/auth";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { data: session, isPending } = useSession();
  const { effectiveRole } = useCurrentUser();

  // Don't render until both session and profile are resolved — effectiveRole defaults to CUSTOMER
  if (isPending) return null;

  if (!session) {
    return <Navigate to="/" replace />;
  }

  // Role lives on the Staff model, not session.user — see useCurrentUser for resolution logic
  if (!allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}