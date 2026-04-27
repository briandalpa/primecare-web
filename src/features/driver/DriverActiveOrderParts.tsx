import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package } from 'lucide-react';
import { DRIVER_ROUTE } from '@/utils/driver';
import { PAYMENT_BADGE } from '@/utils/orderStatus';
import { cn } from '@/lib/utils';
import { PaymentStatus } from '@/types/enums';
import type { DriverOrderSummary } from '@/types/delivery';

export function ItemsCard({ order }: { order: DriverOrderSummary }) {
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

export function EmptyState() {
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
