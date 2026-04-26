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

const SHIFT_OPTIONS = [
  { value: 'SHIFT_1', label: 'Shift 1 (07.00 - 15.00)' },
  { value: 'SHIFT_2', label: 'Shift 2 (13.00 - 21.00)' },
  { value: 'SHIFT_3', label: 'Shift 3 (15.00 - 23.00)' },
] as const;

const createDefaultShiftDate = () => {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const createDefaultValues = (): CreateShiftSchemaInput => {
  return {
    staffId: '',
    shiftDate: createDefaultShiftDate(),
    shiftSlot: 'SHIFT_1',
  };
};

type CreateShiftDialogProps = {
  isPending: boolean;
  open: boolean;
  workers: User[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateShiftSchemaValues) => void;
};

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
                        <SelectItem key={worker.id} value={worker.id}>
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

            <Field data-invalid={!!errors.shiftSlot}>
              <FieldLabel htmlFor="shiftSlot">Shift Time</FieldLabel>
              <Controller
                control={control}
                name="shiftSlot"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="shiftSlot" className="w-full">
                      <SelectValue placeholder="Select shift time" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHIFT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.shiftSlot]} />
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
