import { Card, CardContent } from '@/components/ui/card';
import type { PickupRequest } from '@/types/order';

interface Props {
  total: number;
  pickup?: PickupRequest;
}

export default function OrderSummaryCard({ total, pickup }: Props) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6 space-y-2 text-sm">
        <p className="font-medium text-foreground">Summary</p>
        {pickup && (
          <p className="text-muted-foreground">
            Customer:{' '}
            {pickup.customerUser?.name ?? pickup.customerUser?.email ?? '\u2014'}
          </p>
        )}
        <div className="flex justify-between font-semibold text-foreground border-t pt-2">
          <span>Laundry subtotal</span>
          <span>Rp {total.toLocaleString('id-ID')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
