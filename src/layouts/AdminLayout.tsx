import { Fragment } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { AdminSidebar } from '@/features/admin/AdminSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type BreadcrumbSegment = { label: string; href?: string };

function useBreadcrumbs(): BreadcrumbSegment[] {
  const { pathname } = useLocation();
  if (pathname === '/admin') return [{ label: 'Dashboard' }];
  if (pathname === '/admin/orders') return [{ label: 'Orders' }];
  if (pathname === '/admin/orders/create') {
    return [
      { label: 'Orders', href: '/admin/orders' },
      { label: 'Create Order' },
    ];
  }
  if (pathname.startsWith('/admin/orders/')) {
    return [
      { label: 'Orders', href: '/admin/orders' },
      { label: 'Order Detail' },
    ];
  }
  if (pathname === '/admin/pickup-requests') return [{ label: 'Pickup Requests' }];
  if (pathname === '/admin/outlets') return [{ label: 'Outlets' }];
  if (pathname === '/admin/shifts') return [{ label: 'Shifts' }];
  if (pathname === '/admin/outlets/new') {
    return [{ label: 'Outlets', href: '/admin/outlets' }, { label: 'Create Outlet' }];
  }
  if (pathname.startsWith('/admin/outlets/') && pathname.endsWith('/edit')) {
    return [{ label: 'Outlets', href: '/admin/outlets' }, { label: 'Edit Outlet' }];
  }
  if (pathname === '/admin/users') return [{ label: 'Users' }];
  if (pathname === '/admin/profile') return [{ label: 'Profile' }];
  if (pathname === '/admin/settings') return [{ label: 'Settings' }];
  return [{ label: 'Admin' }];
}

export default function AdminLayout() {
  const { data: session, isPending: sessionPending } = useSession();
  const { effectiveRole, isPending: rolePending } = useCurrentUser();
  const segments = useBreadcrumbs();

  if (sessionPending || rolePending) return null;
  if (!session) return <Navigate to="/admin/login" replace />;

  if (effectiveRole !== 'SUPER_ADMIN' && effectiveRole !== 'OUTLET_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center bg-background px-4 gap-3">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {segments.map((seg, i) => (
                  <Fragment key={seg.label}>
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {i === segments.length - 1 ? (
                        <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={seg.href!}>{seg.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 p-4 md:px-6 md:py-2 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
