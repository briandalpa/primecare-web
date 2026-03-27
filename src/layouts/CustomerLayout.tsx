import { Fragment } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CustomerSidebar } from '@/features/customer/CustomerSidebar';

type BreadcrumbSegment = { label: string; href?: string };

function useBreadcrumbs(): BreadcrumbSegment[] {
  const { pathname } = useLocation();
  if (pathname === '/addresses') return [{ label: 'My Addresses' }];
  if (pathname === '/orders') return [{ label: 'My Orders' }];
  if (pathname.startsWith('/orders/')) {
    return [
      { label: 'My Orders', href: '/orders' },
      { label: 'Order Detail' },
    ];
  }
  if (pathname === '/profile') return [{ label: 'Profile' }];
  if (pathname === '/pickup/create') return [{ label: 'Schedule Pickup' }];
  return [{ label: 'Dashboard' }];
}

export default function CustomerLayout() {
  const { data: session, isPending } = useSession();
  const segments = useBreadcrumbs();

  if (isPending) return null;
  if (!session) return <Navigate to="/auth/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CustomerSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center bg-background px-4 gap-3 border-b border-border/50">
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
          <main className="flex-1 p-4 md:px-6 md:py-4 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
