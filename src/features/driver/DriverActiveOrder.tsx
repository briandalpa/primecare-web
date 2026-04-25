import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MapPin, Phone, User, Package } from 'lucide-react';
import { useCompletePickupRequest } from '@/hooks/useCompletePickupRequest';
import { useCompleteDelivery } from '@/hooks/useCompleteDelivery';
import { useDriverDeliveryOrder } from '@/hooks/useDriverDeliveryOrder';
import { useDriverActiveTask } from '@/hooks/useDriverActiveTask';
import { DRIVER_COPY, DRIVER_ROUTE } from '@/utils/driver';
import { PAYMENT_BADGE } from '@/utils/orderStatus';
import { cn } from '@/lib/utils';
import { PaymentStatus } from '@/types/enums';
import type { DriverOrderSummary } from '@/types/delivery';

export default function DriverActiveOrder() {
  const navigate = useNavigate();
  const { data: task } = useDriverActiveTask();
  const completePickup = useCompletePickupRequest();
  const completeDelivery = useCompleteDelivery();
  const { data: orderSummary, isLoading: summaryLoading } =
    useDriverDeliveryOrder(task?.type === 'delivery' ? task.id : undefined);

  if (!task) return <EmptyState />;

  const typeLabel =
    task.type === 'pickup'
      ? DRIVER_COPY.activeTaskPickupLabel
      : DRIVER_COPY.activeTaskDeliveryLabel;

  const isPending = completePickup.isPending || completeDelivery.isPending;

  const handleComplete = () => {
    const onSuccess = () => navigate(DRIVER_ROUTE.base);
    if (task.type === 'pickup') {
      completePickup.mutate(task.id, { onSuccess });
    } else {
      completeDelivery.mutate(task.id, { onSuccess });
    }
  };

  const addressLine = [
    task.address.label,
    task.address.street,
    task.address.city,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          {DRIVER_COPY.activeTaskTitle}
        </h2>
        <Badge variant="outline">{typeLabel}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base -mb-4">Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{task.customerName ?? DRIVER_COPY.unavailable}</span>
          </div>
          {task.customerPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{task.customerPhone}</span>
            </div>
          )}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{addressLine}</span>
          </div>
        </CardContent>
      </Card>

      {task.type === 'delivery' &&
        (summaryLoading ? (
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Loading summary…
            </CardContent>
          </Card>
        ) : orderSummary ? (
          <ItemsCard order={orderSummary} />
        ) : null)}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg" className="w-full" disabled={isPending}>
            {isPending
              ? DRIVER_COPY.activeTaskCompleting
              : DRIVER_COPY.activeTaskCompleteButton}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {DRIVER_COPY.activeTaskCompleteButton}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Confirm that you have completed this {task.type} task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ItemsCard({ order }: { order: DriverOrderSummary }) {
  return (
    <Card>
      <CardHeader className="-mb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Order Summary</CardTitle>
          {order.paymentStatus === PaymentStatus.PAID && (
            <Badge
              variant="outline"
              className={cn('text-xs capitalize', PAYMENT_BADGE[PaymentStatus.PAID])}
            >
              {order.paymentStatus}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rp {order.subTotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>Rp {order.deliveryFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              Rp {(order.subTotal + order.deliveryFee).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Package className="h-16 w-16 text-muted-foreground/40 mb-4" />
      <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
        No Active Order
      </h2>
      <p className="text-muted-foreground mb-4">
        Accept a request from the dashboard.
      </p>
      <Link to={DRIVER_ROUTE.base}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
