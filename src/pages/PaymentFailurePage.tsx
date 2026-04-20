import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { formatOrderId } from '@/utils/formatters';

export default function PaymentFailurePage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <Navigate to="/orders" replace />;

  return (
    <div className="max-w-lg mx-auto text-center">
      <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Payment Failed
      </h1>
      <p className="text-muted-foreground mb-6">
        Something went wrong while processing payment for <strong>{formatOrderId(id)}</strong>.
        Please try again.
      </p>

      <div className="flex flex-col gap-3">
        <Link to={`/orders/${id}/pay`}>
          <Button className="w-full">Retry Payment</Button>
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
