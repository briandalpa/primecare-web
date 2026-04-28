import { Controller, useForm } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { User } from '@/types/user';
import {
  createShiftSchema,
  type CreateShiftSchemaInput,
  type CreateShiftSchemaValues,
} from './createShiftSchema';
import {
  getCurrentShiftStartTime,
  getDefaultShiftDate,
  SHIFT_TIME_OPTIONS,
} from './shiftTimeOptions';

type CreateShiftDialogProps = {
  isPending: boolean;
  open: boolean;
  workers: User[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateShiftSchemaValues) => void;
};

const createDefaultValues = (): CreateShiftSchemaInput => ({
  staffId: '',
  shiftDate: getDefaultShiftDate(),
  shiftStartTime: getCurrentShiftStartTime(),
});

export function CreateShiftDialog({
  isPending,
  open,
  workers,
  onOpenChange,
  onSubmit,
}: CreateShiftDialogProps) {
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateShiftSchemaInput, undefined, CreateShiftSchemaValues>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: createDefaultValues(),
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset(createDefaultValues());
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Shift</DialogTitle>
          <DialogDescription>
            Create a new active shift for a worker in the current outlet scope.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.staffId}>
              <FieldLabel htmlFor="staffId">Worker</FieldLabel>
              <Controller
                control={control}
                name="staffId"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="staffId" className="w-full">
                      <SelectValue placeholder="Select worker" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem
                          key={worker.staffId ?? worker.id}
                          value={worker.staffId ?? worker.id}
                        >
                          {worker.name} {worker.workerType ? `(${worker.workerType})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.staffId]} />
            </Field>

            <Field data-invalid={!!errors.shiftDate}>
              <FieldLabel htmlFor="shiftDate">Shift Date</FieldLabel>
              <Input id="shiftDate" type="date" {...register('shiftDate')} />
              <FieldError errors={[errors.shiftDate]} />
            </Field>

            <Field data-invalid={!!errors.shiftStartTime}>
              <FieldLabel htmlFor="shiftStartTime">Shift Time</FieldLabel>
              <Controller
                control={control}
                name="shiftStartTime"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="shiftStartTime" className="w-full">
                      <SelectValue placeholder="Select shift time" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHIFT_TIME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.shiftStartTime]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Shift'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
