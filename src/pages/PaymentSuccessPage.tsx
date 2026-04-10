import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomerOrderDetail } from '@/hooks/useCustomerOrderDetail';
import { verifyPayment } from '@/services/payment';
import { PaymentStatus } from '@/types/enums';
import { formatOrderId } from '@/utils/formatters';
import { queryKeys } from '@/utils/queryKeys';

export default function PaymentSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data } = useCustomerOrderDetail(id ?? '');
  const isPaid = data?.data?.paymentStatus === PaymentStatus.PAID;
  const [showRefresh, setShowRefresh] = useState(false);

  useEffect(() => {
    if (isPaid) return;
    const t = setTimeout(() => setShowRefresh(true), 10_000);
    return () => clearTimeout(t);
  }, [isPaid]);

  if (!id) return <Navigate to="/orders" replace />;

  if (!isPaid) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Confirming your payment…</p>
        {showRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={async () => {
              await verifyPayment(id ?? '').catch(() => {});
              queryClient.invalidateQueries({ queryKey: queryKeys.customerOrderDetail(id ?? '') });
            }}
          >
            Refresh status
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Payment Successful!
      </h1>
      <p className="text-muted-foreground mb-2">
        Your payment for <strong>{formatOrderId(id)}</strong> has
        been processed.
      </p>
      <Badge
        variant="outline"
        className="bg-green-100 text-green-700 border-green-200 mb-6"
      >
        Paid
      </Badge>
      <div className="flex flex-col gap-3">
        <Link to={`/orders/${id}`}>
          <Button className="w-full">View Order</Button>
        </Link>
        <Link to="/orders">
          <Button variant="outline" className="w-full">
            Back to Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}
