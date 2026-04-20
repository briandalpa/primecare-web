import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/PageHeader';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import type { OrderStatus } from '@/types/enums';
import { ORDER_STATUS_LABEL } from '@/utils/orderStatus';

const STAT_CARDS = [
  { label: 'Total Orders', href: '/admin/orders' },
  { label: 'Active Outlets', href: '/admin/outlets' },
  { label: 'Registered Users', href: '/admin/users' },
  { label: 'Revenue (MTD)', href: '#' },
];

export default function AdminDashboardPage() {
  const { data, isPending } = useAdminDashboard();
  const stats = data?.data;

  const statValues = stats
    ? [
        String(stats.totalOrders),
        String(stats.activeOutlets),
        String(stats.registeredUsers),
        `Rp ${stats.revenueMtd.toLocaleString('id-ID')}`,
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, href }, i) => (
          <Link to={href} key={label}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPending || !stats ? (
                  <Skeleton className="h-9 w-24" />
                ) : (
                  <div className="text-3xl font-bold text-foreground">{statValues[i]}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Button variant="link" size="sm" className="h-auto p-0 text-sm" asChild>
            <Link to="/admin/orders">View all →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : !stats?.recentOrders?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent orders.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Order ID</th>
                    <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Outlet</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/40">
                      <td className="py-3 font-medium font-mono text-xs text-muted-foreground">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="py-3">{order.customerName}</td>
                      <td className="py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          {ORDER_STATUS_LABEL[order.status as OrderStatus] ?? order.status}
                        </span>
                      </td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground">{order.outletName}</td>
                      <td className="py-3 hidden lg:table-cell text-muted-foreground">{order.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
