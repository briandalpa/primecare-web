import { Card, CardContent } from '@/components/ui/card';

interface Props {
  totalWeightKg: number;
  pricePerKg: number;
  totalPrice: number;
  deliveryFee: number;
  deliveryDistanceKm?: number;
}

export default function OrderPriceCard({ totalWeightKg, pricePerKg, totalPrice, deliveryFee, deliveryDistanceKm }: Props) {
  const laundrySubtotal = totalWeightKg * pricePerKg;
  const deliveryLabel = deliveryDistanceKm != null && deliveryDistanceKm > 0
    ? `Delivery (${deliveryDistanceKm.toFixed(1)} km)`
    : 'Delivery';

  return (
    <Card>
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Weight</span>
          <span>{totalWeightKg} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price / kg</span>
          <span>Rp {pricePerKg.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Laundry</span>
          <span>Rp {laundrySubtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{deliveryLabel}</span>
          <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
            {deliveryFee === 0 ? 'Free' : `Rp ${deliveryFee.toLocaleString('id-ID')}`}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-foreground border-t pt-2">
          <span>Total</span>
          <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
