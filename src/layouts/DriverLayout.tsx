import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DriverSidebar } from '@/features/driver/DriverSidebar';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { DRIVER_ROUTE } from '@/utils/driver';

export default function DriverLayout() {
  const { data: session, isPending: sessionPending } = useSession();
  const { effectiveRole, isPending: rolePending } = useCurrentUser();

  if (sessionPending || rolePending) return null;
  if (!session) return <Navigate to={DRIVER_ROUTE.home} replace />;
  if (effectiveRole !== 'DRIVER') return <Navigate to={DRIVER_ROUTE.forbidden} replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DriverSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-heading font-semibold text-foreground">PrimeCare Driver</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-muted/40">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
