import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getDashboardRoute } from "@/utils/auth";

export function GuestRoute() {
  const { data: session } = useSession();
  const { effectiveRole, isPending } = useCurrentUser();

  if (isPending) return null;
  if (session) return <Navigate to={getDashboardRoute(effectiveRole)} replace />;

  return <Outlet />;
}
