import { Fragment } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { DriverSidebar } from '@/features/driver/DriverSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { DRIVER_COPY, DRIVER_ROUTE } from '@/utils/driver';

type BreadcrumbSegment = { label: string; href?: string };

function useBreadcrumbs(): BreadcrumbSegment[] {
  const { pathname } = useLocation();

  if (pathname === DRIVER_ROUTE.dashboard || pathname === DRIVER_ROUTE.base) {
    return [{ label: DRIVER_COPY.dashboardTitle }];
  }

  if (pathname === DRIVER_ROUTE.history) {
    return [{ label: DRIVER_COPY.historyTitle }];
  }

  return [{ label: DRIVER_COPY.driverRoleLabel }];
}

export default function DriverLayout() {
  const { data: session, isPending: sessionPending } = useSession();
  const { effectiveRole, isPending: rolePending } = useCurrentUser();
  const segments = useBreadcrumbs();

  if (sessionPending || rolePending) return null;
  if (!session) return <Navigate to={DRIVER_ROUTE.home} replace />;
  if (effectiveRole !== 'DRIVER') return <Navigate to={DRIVER_ROUTE.forbidden} replace />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DriverSidebar />

        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 bg-background px-4">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {segments.map((segment, index) => (
                  <Fragment key={segment.label}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === segments.length - 1 ? (
                        <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={segment.href!}>{segment.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <main className="flex-1 bg-muted/30 p-4 md:px-6 md:py-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
