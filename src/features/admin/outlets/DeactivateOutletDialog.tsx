import type { Outlet } from '@/types/outlet';
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

type DeactivateOutletDialogProps = {
  outlet: Outlet | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeactivateOutletDialog({
  outlet,
  isPending,
  onClose,
  onConfirm,
}: DeactivateOutletDialogProps) {
  return (
    <AlertDialog open={!!outlet} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Outlet</AlertDialogTitle>
          <AlertDialogDescription>
            Deactivating <strong>{outlet?.name}</strong> removes this outlet from
            nearest-outlet calculations. Please confirm no active orders are still
            pending for this outlet before continuing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Deactivating...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
