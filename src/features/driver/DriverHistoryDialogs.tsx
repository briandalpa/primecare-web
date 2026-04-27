import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { useDriverDeliveryOrder } from '@/hooks/useDriverDeliveryOrder';
import type { PickupHistoryItem } from '@/types/delivery';
import { DRIVER_UI_TEXT, formatDriverDateTime } from '@/utils/driver';

export function DeliveryDetailDialog({
  deliveryId,
  onClose,
}: {
  deliveryId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useDriverDeliveryOrder(deliveryId ?? undefined);

  return (
    <Dialog open={!!deliveryId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="left-[50%] w-[calc(100%-2rem)] max-w-md translate-x-[-50%] sm:w-full">
        <DialogHeader>
          <DialogTitle>
            Delivery #{deliveryId?.slice(-6).toUpperCase()}
          </DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {data && (
          <div className="space-y-3 text-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      Rp{' '}
                      {(item.quantity * item.unitPrice).toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Delivery Fee</span>
              <span>Rp {data.deliveryFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                Rp{' '}
                {(data.totalPrice + data.deliveryFee).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function PickupDetailDialog({
  pickup,
  onClose,
}: {
  pickup: PickupHistoryItem | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!pickup} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="left-[50%] w-[calc(100%-2rem)] max-w-md translate-x-[-50%] sm:w-full">
        <DialogHeader>
          <DialogTitle>
            Pickup #{pickup?.id.slice(-6).toUpperCase()}
          </DialogTitle>
        </DialogHeader>
        {pickup && (
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Customer: </span>
              <span>{pickup.customerName ?? '—'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Address: </span>
              <span>
                {pickup.pickupAddress.street}, {pickup.pickupAddress.city}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">
                {DRIVER_UI_TEXT.historyCompletedAtLabel}:{' '}
              </span>
              <span>{formatDriverDateTime(pickup.completedAt)}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
