import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  CreditCard,
  MessageSquareWarning,
  PackageCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useCustomerOrderDetail } from '@/hooks/useCustomerOrderDetail';
import { useConfirmOrderReceipt } from '@/hooks/useConfirmOrderReceipt';
import { useComplaintByOrderId } from '@/hooks/useComplaintByOrderId';
import { OrderStatus, PaymentStatus } from '@/types/enums';
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  PAYMENT_BADGE,
} from '@/utils/orderStatus';
import { cn } from '@/lib/utils';
import type { CustomerOrderDetail as OrderDetailType } from '@/types/order';
import type { Complaint } from '@/types/complaint';
import StatusTimeline from '@/features/orders/StatusTimeline';
import StatusTimelineDrawer from '@/features/orders/StatusTimelineDrawer';
import OrderItemsCard from '@/features/orders/OrderItemsCard';
import OrderPriceCard from '@/features/orders/OrderPriceCard';
import { FileComplaintDialog } from '@/features/complaint/FileComplaintDialog';

export default function CustomerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isPending, isError } = useCustomerOrderDetail(id ?? '');
  const confirmMutation = useConfirmOrderReceipt(id ?? '');
  const { complaint } = useComplaintByOrderId(id ?? '');

  if (isPending) {
    return <p className="text-center text-muted-foreground py-8">Loading...</p>;
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Order not found.</p>
        <Button
          variant="link"
          className="mt-4"
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate('/orders')}
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
      </Button>
      <Header order={order} />

      {/* Mobile: payment CTA at top */}
      <div className="md:hidden mb-4">
        <PaymentActions order={order} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Desktop: full timeline in left column */}
        <div className="hidden md:block">
          <StatusTimeline status={order.status} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <OrderItemsCard
            items={order.items.map((i) => ({
              id: i.id,
              name: i.itemName,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              lineTotal: i.lineTotal,
              isManualPriced: i.isManualPriced,
            }))}
          />
          <OrderPriceCard
            totalWeightKg={order.totalWeightKg}
            pricePerKg={order.pricePerKg}
            totalPrice={order.totalPrice}
            deliveryFee={order.deliveryFee}
            deliveryDistanceKm={order.deliveryDistanceKm}
          />
          {/* Desktop: actions inside grid column */}
          <div className="hidden md:block">
            <Actions
              order={order}
              complaint={complaint}
              onConfirm={() => confirmMutation.mutate()}
              confirming={confirmMutation.isPending}
            />
          </div>
        </div>
      </div>

      {/* Mobile: compact timeline + non-payment actions at bottom */}
      <div className="md:hidden space-y-4">
        <StatusTimelineDrawer status={order.status} />
        <Actions
          order={order}
          complaint={complaint}
          onConfirm={() => confirmMutation.mutate()}
          confirming={confirmMutation.isPending}
          hideMobilePayment
        />
      </div>
    </div>
  );
}

function Header({ order }: { order: OrderDetailType }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order</h1>
        <p className="text-sm text-muted-foreground">
          Placed {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge
          variant="outline"
          className={cn('text-xs', ORDER_STATUS_COLOR[order.status])}
        >
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            'text-xs capitalize',
            PAYMENT_BADGE[order.paymentStatus],
          )}
        >
          {order.paymentStatus}
        </Badge>
      </div>
    </div>
  );
}

function PaymentActions({ order }: { order: OrderDetailType }) {
  if (
    order.status !== OrderStatus.WAITING_FOR_PAYMENT ||
    order.paymentStatus === PaymentStatus.PAID
  ) {
    return null;
  }
  return (
    <>
      {(!order.payment ||
        order.payment.status === PaymentStatus.EXPIRED ||
        order.payment.status === PaymentStatus.UNPAID) && (
        <Link to={`/orders/${order.id}/pay`}>
          <Button className="w-full md:w-auto">
            <CreditCard className="h-4 w-4 mr-2" /> Pay Now
          </Button>
        </Link>
      )}
      {order.payment?.status === PaymentStatus.PENDING && (
        <Link to={`/orders/${order.id}/pay`}>
          <Button variant="outline" className="w-full md:w-auto">
            <CreditCard className="h-4 w-4 mr-2" /> Complete Payment
          </Button>
        </Link>
      )}
      {order.payment?.status === PaymentStatus.FAILED && (
        <Link to={`/orders/${order.id}/pay`}>
          <Button variant="destructive" className="w-full md:w-auto">
            <CreditCard className="h-4 w-4 mr-2" /> Retry Payment
          </Button>
        </Link>
      )}
    </>
  );
}

function ConfirmReceiptDialog({
  onConfirm,
  confirming,
}: {
  onConfirm: () => void;
  confirming: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={confirming}>
          <PackageCheck className="h-4 w-4 mr-2" /> Confirm Receipt
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Receipt</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you've received all items? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={confirming}>
            {confirming ? 'Confirming...' : 'Yes, I received my order'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Actions({
  order,
  complaint,
  onConfirm,
  confirming,
  hideMobilePayment = false,
}: {
  order: OrderDetailType;
  complaint: Complaint | null | undefined;
  onConfirm: () => void;
  confirming: boolean;
  hideMobilePayment?: boolean;
}) {
  const isDelivered =
    order.status === OrderStatus.LAUNDRY_DELIVERED_TO_CUSTOMER;
  const hasActions =
    (!hideMobilePayment && order.status === OrderStatus.WAITING_FOR_PAYMENT) ||
    isDelivered ||
    !!complaint;

  if (!hasActions) return null;

  return (
    <div className="flex gap-3 flex-wrap">
      {!hideMobilePayment && <PaymentActions order={order} />}
      {isDelivered && (
        <ConfirmReceiptDialog onConfirm={onConfirm} confirming={confirming} />
      )}
      {isDelivered && !complaint && <FileComplaintDialog orderId={order.id} />}
      {complaint && (
        <Link to={`/complaints/${complaint.id}`}>
          <Button variant="outline">
            <MessageSquareWarning className="h-4 w-4 mr-2" /> View Complaint
          </Button>
        </Link>
      )}
    </div>
  );
}
