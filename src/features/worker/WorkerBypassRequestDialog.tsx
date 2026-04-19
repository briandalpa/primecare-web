import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  workerBypassRequestSchema,
  type WorkerBypassRequestFormValues,
} from '@/features/worker/workerBypassRequestSchema';
import { WORKER_COPY } from '@/utils/worker';

export type WorkerMismatchItem = {
  itemName: string;
  laundryItemId: string;
  referenceQuantity: number;
  submittedQuantity: number;
};

type WorkerBypassRequestDialogProps = {
  isSubmitting: boolean;
  items: WorkerMismatchItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: WorkerBypassRequestFormValues) => void;
};

export function WorkerBypassRequestDialog({
  isSubmitting,
  items,
  open,
  onOpenChange,
  onSubmit,
}: WorkerBypassRequestDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkerBypassRequestFormValues>({
    resolver: zodResolver(workerBypassRequestSchema),
    defaultValues: { notes: '' },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const submit = (values: WorkerBypassRequestFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{WORKER_COPY.processOrderBypassDialogTitle}</DialogTitle>
          <DialogDescription>
            {WORKER_COPY.processOrderBypassDialogDescription}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(submit)}>
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {WORKER_COPY.processOrderBypassSummaryTitle}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{WORKER_COPY.processOrderItemLabel}</TableHead>
                  <TableHead>{WORKER_COPY.processOrderReferenceQuantity}</TableHead>
                  <TableHead>{WORKER_COPY.processOrderInputQuantity}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.laundryItemId}>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.referenceQuantity}</TableCell>
                    <TableCell>{item.submittedQuantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <FieldGroup>
            <Field data-invalid={!!errors.notes}>
              <FieldLabel htmlFor="bypass-notes">
                {WORKER_COPY.processOrderBypassNotesLabel}
              </FieldLabel>
              <Textarea
                id="bypass-notes"
                placeholder={WORKER_COPY.processOrderBypassNotesPlaceholder}
                {...register('notes')}
              />
              <FieldError errors={[errors.notes]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              {WORKER_COPY.processOrderBypassCancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? WORKER_COPY.processOrderBypassSubmitting
                : WORKER_COPY.processOrderBypassConfirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
