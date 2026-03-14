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

  // tunggu session selesai loading
  if (isPending) return null;

  // jika belum login jangan redirect dulu saat development
  if (!session) {
    return <Outlet />;
  }

  // cek role
  if (!allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}