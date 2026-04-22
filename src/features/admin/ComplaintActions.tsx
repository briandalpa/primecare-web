import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ComplaintStatus } from '@/types/enums';
import { COMPLAINT_STATUS_LABEL } from '@/utils/complaint';

interface Props {
  complaint: { id: string; status: ComplaintStatus };
  onUpdate: (id: string, next: ComplaintStatus) => void;
}

export function ComplaintActions({ complaint, onUpdate }: Props) {
  if (complaint.status === ComplaintStatus.RESOLVED) {
    return <span className="text-xs text-muted-foreground">No actions</span>;
  }

  const nextStatus =
    complaint.status === ComplaintStatus.OPEN
      ? ComplaintStatus.IN_REVIEW
      : ComplaintStatus.RESOLVED;
  const label =
    nextStatus === ComplaintStatus.IN_REVIEW ? 'Start Review' : 'Mark Resolved';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant={nextStatus === ComplaintStatus.RESOLVED ? 'default' : 'outline'}
        >
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will move the complaint to{' '}
            <strong>{COMPLAINT_STATUS_LABEL[nextStatus]}</strong>. The customer will see this
            update.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onUpdate(complaint.id, nextStatus)}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
