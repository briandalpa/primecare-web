import { CalendarIcon, MapPin, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import type { Address } from '@/types/address';

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  address?: Address;
  date?: Date;
  timeLabel: string;
  isPending: boolean;
  onConfirm: () => void;
};

export default function PickupConfirmDialog({
  open,
  onOpenChange,
  address,
  date,
  timeLabel,
  isPending,
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-xl">
            Confirm Your Pickup
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2 text-left">
              {address && (
                <div className="flex gap-3 items-start">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {address.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.street}, {address.city}, {address.province}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 items-start">
                <CalendarIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {date ? format(date, 'd MMMM yyyy') : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">{timeLabel}</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3 items-start">
                <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  A driver from the nearest outlet will be assigned to your
                  pickup.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel disabled={isPending}>Go Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-full px-6"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming…
              </>
            ) : (
              'Confirm Pickup'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
