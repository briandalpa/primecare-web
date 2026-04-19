import { Fragment } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
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

type BreadcrumbRule = {
  match: (p: string) => boolean;
  segments: (p: string) => BreadcrumbSegment[];
};

const BREADCRUMB_RULES: BreadcrumbRule[] = [
  { match: (p) => p === '/addresses', segments: () => [{ label: 'My Addresses' }] },
  { match: (p) => p === '/orders', segments: () => [{ label: 'My Orders' }] },
  { match: (p) => p === '/profile', segments: () => [{ label: 'Profile' }] },
  { match: (p) => p === '/pickup/create', segments: () => [{ label: 'Schedule Pickup' }] },
  {
    match: (p) => p.endsWith('/pay'),
    segments: (p) => [
      { label: 'My Orders', href: '/orders' },
      { label: 'Order Detail', href: p.replace('/pay', '') },
      { label: 'Payment' },
    ],
  },
  {
    match: (p) => p.endsWith('/payment-success'),
    segments: () => [{ label: 'My Orders', href: '/orders' }, { label: 'Payment Successful' }],
  },
  {
    match: (p) => p.endsWith('/payment-failure'),
    segments: () => [{ label: 'My Orders', href: '/orders' }, { label: 'Payment Failed' }],
  },
  {
    match: (p) => p.startsWith('/orders/'),
    segments: () => [{ label: 'My Orders', href: '/orders' }, { label: 'Order Detail' }],
  },
];

function useBreadcrumbs(): BreadcrumbSegment[] {
  const { pathname } = useLocation();
  const rule = BREADCRUMB_RULES.find((r) => r.match(pathname));
  return rule ? rule.segments(pathname) : [{ label: 'Dashboard' }];
}

export default function CustomerLayout() {
  const { data: session, isPending: sessionPending } = useSession();
  const { effectiveRole, isPending: rolePending } = useCurrentUser();
  const segments = useBreadcrumbs();

  if (sessionPending || rolePending) return null;
  if (!session) return <Navigate to="/auth/login" replace />;
  if (effectiveRole !== 'CUSTOMER') return <Navigate to="/forbidden" replace />;

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
                          {seg.href ? (
                            <Link to={seg.href}>{seg.label}</Link>
                          ) : (
                            <span>{seg.label}</span>
                          )}
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
