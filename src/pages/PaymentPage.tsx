import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCustomerOrderDetail } from '@/hooks/useCustomerOrderDetail';
import { useInitiatePayment } from '@/hooks/useInitiatePayment';
import { verifyPayment } from '@/services/payment';
import { OrderStatus, PaymentStatus } from '@/types/enums';
import { loadSnapScript } from '@/utils/midtrans';
import { formatOrderId } from '@/utils/formatters';
import { queryKeys } from '@/utils/queryKeys';
import type { InitiatePaymentResponse } from '@/types/payment';

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useCustomerOrderDetail(id ?? '');
  const { mutate: initiatePayment, isPending } = useInitiatePayment();

  useEffect(() => {
    loadSnapScript();
  }, []);

  function buildSnapCallbacks() {
    return {
      onSuccess: () => {
        verifyPayment(id ?? '').catch(() => {});
        queryClient.invalidateQueries({ queryKey: queryKeys.customerOrderDetail(id ?? '') });
        queryClient.invalidateQueries({ queryKey: queryKeys.customerOrders() });
        navigate(`/orders/${id}/payment-success`);
      },
      onPending: () => {
        toast.info('Payment pending — complete the transfer to confirm your order.');
        navigate(`/orders/${id}`);
      },
      onError: () => navigate(`/orders/${id}/payment-failure`),
      onClose: () => toast.info('Payment cancelled. You can retry anytime.'),
    };
  }

  function handleSnapReady(payment: InitiatePaymentResponse) {
    if (!window.snap) {
      if (payment.redirectUrl) window.location.assign(payment.redirectUrl);
      else toast.error('Payment service unavailable. Please try again later.');
      return;
    }
    window.snap.pay(payment.snapToken, buildSnapCallbacks());
  }

  const handlePay = async () => {
    try {
      await loadSnapScript();
    } catch {
      toast.error('Payment service unavailable. Please try again later.');
      return;
    }
    initiatePayment(order!.id, {
      onSuccess: ({ data: payment }) => handleSnapReady(payment),
      onError: () => navigate(`/orders/${id}/payment-failure`),
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading order…</p>;
  }

  const order = data?.data;

  if (!order) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Order not found.</p>
        <Link to="/orders">
          <Button variant="link" className="mt-4">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <p className="font-semibold text-foreground mb-1">
          Payment already completed
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          This order has already been paid.
        </p>
        <Button onClick={() => navigate(`/orders/${id}`)}>View Order</Button>
      </div>
    );
  }

  if (order.status !== OrderStatus.WAITING_FOR_PAYMENT) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          This order is not eligible for payment at this time.
        </p>
        <Button onClick={() => navigate(`/orders/${id}`)}>View Order</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate(`/orders/${id}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Order
      </Button>

      <h1 className="text-2xl font-bold text-foreground mb-6">
        Payment — {formatOrderId(order.id)}
      </h1>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Weight</span>
              <span>{order.totalWeightKg} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per kg</span>
              <span>Rp {order.pricePerKg.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-semibold text-foreground border-t pt-2">
              <span>Total</span>
              <span>Rp {order.totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        size="lg"
        onClick={handlePay}
        disabled={isPending}
      >
        <CreditCard className="h-5 w-5 mr-2" />
        {isPending
          ? 'Preparing payment…'
          : `Pay Now — Rp ${order.totalPrice.toLocaleString('id-ID')}`}
      </Button>
    </div>
  );
}
