import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, FileText, MapPin, Package } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  getOrderProgressPct,
  getOrderStageLabel,
} from '@/utils/orderStatus';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/enums';

type QuickAction = { label: string; icon: React.ElementType; to: string };

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'New Pickup', icon: CalendarPlus, to: '/pickup/create' },
  { label: 'My Orders', icon: FileText, to: '/orders' },
  { label: 'Addresses', icon: MapPin, to: '/addresses' },
];

function ActiveOrderCard({
  status,
  orderId,
  outletName,
}: {
  status: OrderStatus;
  orderId: string;
  outletName: string;
}) {
  const pct = getOrderProgressPct(status);
  const activeStage = getOrderStageLabel(status);
  const stages = ['Pickup', 'Processing', 'Delivery'] as const;

  return (
    <Card className="border-primary/25">
      <CardContent>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-sm font-semibold">
              Order #{orderId.slice(0, 8)}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {outletName}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn('text-xs shrink-0', ORDER_STATUS_COLOR[status])}
          >
            {ORDER_STATUS_LABEL[status]}
          </Badge>
        </div>
        <div className="mt-3 mb-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between">
          {stages.map((s) => (
            <span
              key={s}
              className={cn(
                'text-[10px] font-medium',
                s === activeStage ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {s}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NoActiveOrder() {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-5 pb-5 flex flex-col items-center text-center gap-2">
        <Package className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No active orders right now.
        </p>
        <Link
          to="/pickup/create"
          className="text-sm font-medium text-primary hover:underline"
        >
          Schedule a pickup →
        </Link>
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboardPage() {
  const { profile } = useCurrentUser();

  const { data: activeData } = useCustomerOrders({
    excludeCompleted: true,
    limit: 1,
    page: 1,
  });
  const { data: recentData } = useCustomerOrders({ limit: 3, page: 1 });

  const activeOrder = activeData?.data[0];
  const recentOrders = recentData?.data ?? [];

  useEffect(() => {
    document.title = 'Dashboard — PrimeCare';
  }, []);

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <h1 className="text-xl font-bold">
          Hello, {profile?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back to PrimeCare.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold mb-2">Active Order</h2>
        {activeOrder ? (
          <Link to={`/orders/${activeOrder.id}`}>
            <ActiveOrderCard
              status={activeOrder.status}
              orderId={activeOrder.id}
              outletName={activeOrder.outletName}
            />
          </Link>
        ) : (
          <NoActiveOrder />
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold mb-2">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
            <Link key={to} to={to}>
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-card border p-3 text-center hover:border-primary/40 hover:bg-accent transition-colors">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium leading-tight">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {recentOrders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Recent Activity</h2>
            <Link to="/orders" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`}>
                <Card className="hover:border-primary/30 transition-colors">
                  <CardContent className="px-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.createdAt), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">
                        Rp {(order.totalPrice ?? 0).toLocaleString('id-ID')}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          ORDER_STATUS_COLOR[order.status],
                        )}
                      >
                        {ORDER_STATUS_LABEL[order.status]}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
