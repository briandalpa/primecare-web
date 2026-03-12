import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { UserRole } from "@/utils/auth";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { data: session } = useSession();
  const { effectiveRole, isPending } = useCurrentUser();

  if (isPending) return null;
  if (!session) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(effectiveRole)) return <Navigate to="/" replace />;

  return <Outlet />;
}
