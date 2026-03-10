import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type UserRole = "SUPER_ADMIN" | "OUTLET_ADMIN";

interface AdminRoleRouteProps {
  allowedRoles: UserRole[];
}

export default function AdminRoleRoute({ allowedRoles }: AdminRoleRouteProps) {
  const { profile, effectiveRole } = useCurrentUser();

  // belum login
  if (!profile) {
    return <Navigate to="/" replace />;
  }

  // role tidak diizinkan
  if (!effectiveRole || !allowedRoles.includes(effectiveRole as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}