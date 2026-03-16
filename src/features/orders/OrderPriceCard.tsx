import { Card, CardContent } from '@/components/ui/card';

interface Props {
  totalWeightKg: number;
  pricePerKg: number;
  totalPrice: number;
}

export default function OrderPriceCard({ totalWeightKg, pricePerKg, totalPrice }: Props) {
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
        <div className="flex justify-between font-semibold text-foreground border-t pt-2">
          <span>Total</span>
          <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
