import { Fragment } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { WorkerSidebar } from '@/features/worker/WorkerSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { WORKER_COPY, WORKER_ROUTE } from '@/utils/worker';

type BreadcrumbSegment = {
  label: string;
  href?: string;
};

function useBreadcrumbs(): BreadcrumbSegment[] {
  const { pathname } = useLocation();

  if (pathname === WORKER_ROUTE.dashboard) {
    return [{ label: WORKER_COPY.dashboardTitle }];
  }

  if (pathname.startsWith('/worker/orders/') && pathname.endsWith('/process')) {
    return [
      { label: WORKER_COPY.dashboardTitle, href: WORKER_ROUTE.dashboard },
      { label: WORKER_COPY.processOrderTitle },
    ];
  }

  return [{ label: WORKER_COPY.workerRoleLabel }];
}

export default function WorkerLayout() {
  const { data: session, isPending: sessionPending } = useSession();
  const { effectiveRole, isPending: rolePending } = useCurrentUser();
  const segments = useBreadcrumbs();

  if (sessionPending || rolePending) return null;
  if (!session) return <Navigate to={WORKER_ROUTE.home} replace />;
  if (effectiveRole !== 'WORKER') {
    return <Navigate to={WORKER_ROUTE.forbidden} replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <WorkerSidebar />

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
