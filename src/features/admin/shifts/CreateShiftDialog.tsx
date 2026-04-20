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

const createDefaultStartedAt = () => {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
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
    defaultValues: {
      staffId: '',
      startedAt: createDefaultStartedAt(),
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset({ staffId: '', startedAt: createDefaultStartedAt() });
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

            <Field data-invalid={!!errors.startedAt}>
              <FieldLabel htmlFor="startedAt">Start Time</FieldLabel>
              <Input id="startedAt" type="datetime-local" {...register('startedAt')} />
              <FieldError errors={[errors.startedAt]} />
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
