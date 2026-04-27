import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock } from 'lucide-react';
import { DRIVER_UI_TEXT, formatDriverDateTime } from '@/utils/driver';
import type { DriverPickupListItem, DeliveryListItem } from '@/types/delivery';

export function PickupRequestCard({
  item,
  hasActive,
  isPending,
  onAccept,
}: {
  item: DriverPickupListItem;
  hasActive: boolean;
  isPending: boolean;
  onAccept: () => void;
}) {
  const phone = item.address.phone ?? item.customer.phone;
  const address = [item.address.label, item.address.street, item.address.city]
    .filter(Boolean)
    .join(', ');
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-3">
        <p className="font-bold text-foreground">
          {item.customer.name ?? DRIVER_UI_TEXT.unavailable}
        </p>
        {phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-foreground">{phone}</span>
          </div>
        )}
        <div className="flex items-start gap-2.5 text-sm">
          <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-foreground leading-tight pt-1">{address}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-muted-foreground">
            {formatDriverDateTime(item.scheduledAt)}
          </span>
        </div>
        {!hasActive && (
          <Button
            size="sm"
            className="w-full"
            onClick={onAccept}
            disabled={isPending}
          >
            {isPending ? DRIVER_UI_TEXT.accepting : DRIVER_UI_TEXT.acceptButton}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function DeliveryRequestCard({
  item,
  hasActive,
  isPending,
  onAccept,
}: {
  item: DeliveryListItem;
  hasActive: boolean;
  isPending: boolean;
  onAccept: () => void;
}) {
  const phone = item.deliveryAddress.phone ?? item.customer.phone;
  const address = [
    item.deliveryAddress.label,
    item.deliveryAddress.street,
    item.deliveryAddress.city,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-foreground">
            {item.customer.name ?? DRIVER_UI_TEXT.unavailable}
          </p>
          <Badge variant="outline" className="text-xs shrink-0">
            {item.orderId.slice(0, 8)}
          </Badge>
        </div>
        {phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-foreground">{phone}</span>
          </div>
        )}
        <div className="flex items-start gap-2.5 text-sm">
          <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-foreground leading-tight pt-1.5">
            {address}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-muted-foreground">
            {formatDriverDateTime(item.createdAt)}
          </span>
        </div>
        {!hasActive && (
          <Button
            size="sm"
            className="w-full"
            onClick={onAccept}
            disabled={isPending}
          >
            {isPending ? DRIVER_UI_TEXT.accepting : DRIVER_UI_TEXT.acceptButton}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
