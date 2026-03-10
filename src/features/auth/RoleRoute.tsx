import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/lib/auth-client";

type UserRole = "CUSTOMER" | "SUPER_ADMIN" | "OUTLET_ADMIN" | "WORKER" | "DRIVER";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { data: session, isPending } = useSession();

  if (isPending) return null;
  if (!session) return <Navigate to="/" replace />;

  const role = session.user.role as UserRole;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
