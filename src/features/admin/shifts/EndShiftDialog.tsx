import type { Shift } from '@/types/shift';
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

type EndShiftDialogProps = {
  isPending: boolean;
  open: boolean;
  shift: Shift | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function EndShiftDialog({
  isPending,
  open,
  shift,
  onClose,
  onConfirm,
}: EndShiftDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Shift</AlertDialogTitle>
          <AlertDialogDescription>
            End the active shift for <strong>{shift?.workerName}</strong>. The worker
            will no longer be able to process station work until a new shift is created.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Ending...' : 'End Shift'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
