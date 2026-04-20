import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminOrderDetail } from '@/hooks/useAdminOrderDetail';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, PAYMENT_BADGE } from '@/utils/orderStatus';
import { cn } from '@/lib/utils';
import StatusTimeline from '@/features/orders/StatusTimeline';
import OrderItemsCard from '@/features/orders/OrderItemsCard';
import OrderPriceCard from '@/features/orders/OrderPriceCard';
import type { AdminOrderDetail } from '@/types/order';

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isPending, isError } = useAdminOrderDetail(id ?? '');

  if (isPending) {
    return <p className="text-center text-muted-foreground py-8">Loading...</p>;
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Order not found.</p>
        <Button variant="link" className="mt-4" onClick={() => navigate('/admin/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/admin/orders')}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
      </Button>
      <OrderHeader order={order} />
      <div className="grid md:grid-cols-3 gap-6">
        <StatusTimeline status={order.status} />
        <div className="md:col-span-2 space-y-6">
          <CustomerCard order={order} />
          <OrderItemsCard items={order.items.map((i) => ({ id: i.id, name: i.laundryItem.name, quantity: i.quantity }))} />
          <OrderPriceCard
            totalWeightKg={order.totalWeightKg}
            pricePerKg={order.pricePerKg}
            totalPrice={order.totalPrice}
          />
          <StationRecordsCard order={order} />
        </div>
      </div>
    </div>
  );
}

function OrderHeader({ order }: { order: AdminOrderDetail }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order</h1>
        <p className="text-sm text-muted-foreground">
          Created {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
        </p>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline" className={cn('text-xs', ORDER_STATUS_COLOR[order.status])}>
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
        <Badge variant="outline" className={cn('text-xs capitalize', PAYMENT_BADGE[order.paymentStatus])}>
          {order.paymentStatus}
        </Badge>
      </div>
    </div>
  );
}

function CustomerCard({ order }: { order: AdminOrderDetail }) {
  const customer = order.pickupRequest?.customerUser;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p><span className="text-muted-foreground">Name:</span> {customer?.name ?? '\u2014'}</p>
        <p><span className="text-muted-foreground">Email:</span> {customer?.email ?? '\u2014'}</p>
        <p><span className="text-muted-foreground">Outlet:</span> {order.outlet?.name ?? '\u2014'}</p>
      </CardContent>
    </Card>
  );
}

type BypassRequest = AdminOrderDetail['stationRecords'][number]['bypassRequests'][number];

function BypassRequestItem({ bp }: { bp: BypassRequest }) {
  return (
    <div className="text-xs bg-muted p-2 rounded">
      <span className="font-medium">Bypass: {bp.status}</span>
      {bp.problemDescription && (
        <p className="text-muted-foreground">{bp.problemDescription}</p>
      )}
    </div>
  );
}

function StationRecordsCard({ order }: { order: AdminOrderDetail }) {
  if (!order.stationRecords?.length) return null;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Station Records</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.stationRecords.map((rec) => (
          <div key={rec.id} className="border rounded-lg p-3 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{rec.station}</span>
              <Badge variant="outline" className="text-xs">{rec.status}</Badge>
            </div>
            <p className="text-muted-foreground">Worker: {rec.staff?.user?.name ?? '\u2014'}</p>
            {rec.completedAt && (
              <p className="text-muted-foreground">
                Completed: {format(new Date(rec.completedAt), 'dd MMM yyyy, HH:mm')}
              </p>
            )}
            {rec.bypassRequests?.length > 0 && (
              <div className="mt-2 space-y-1">
                {rec.bypassRequests.map((bp) => (
                  <BypassRequestItem key={bp.id} bp={bp} />
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
