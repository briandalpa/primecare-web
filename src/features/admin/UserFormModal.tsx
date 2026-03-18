import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from './userFormSchema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { User } from '@/types/user';

const ROLE_OPTIONS = [
  { value: 'OUTLET_ADMIN', label: 'Outlet Admin' },
  { value: 'WORKER', label: 'Worker' },
  { value: 'DRIVER', label: 'Driver' },
] as const;

// ─── Create form ─────────────────────────────────────────────────────────────

const CreateForm = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', role: 'WORKER', outletId: '' },
  });

  const roleValue = useWatch({ control, name: 'role' });
  const { mutate, isPending } = useCreateUser(() => {
    onSuccess();
    onClose();
  });

  const onSubmit = (data: CreateUserFormValues) =>
    mutate({ ...data, outletId: data.outletId || undefined });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="mb-6">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="Full name" {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            {...register('email')}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.role}>
          <FieldLabel>Role</FieldLabel>
          <Select
            value={roleValue}
            onValueChange={(val) =>
              setValue('role', val as CreateUserFormValues['role'])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.role]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="outletId">Outlet ID (optional)</FieldLabel>
          <Input
            id="outletId"
            placeholder="Outlet ID"
            {...register('outletId')}
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

// ─── Edit form ────────────────────────────────────────────────────────────────

const EditForm = ({
  user,
  onClose,
  onSuccess,
}: {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      role: user.role as UpdateUserFormValues['role'],
      outletId: user.outlet?.id ?? '',
      isActive: true,
    },
  });

  const roleValue = useWatch({ control, name: 'role' });
  const isActiveValue = useWatch({ control, name: 'isActive' });
  const { mutate, isPending } = useUpdateUser(() => {
    onSuccess();
    onClose();
  });

  const onSubmit = (data: UpdateUserFormValues) =>
    mutate({
      userId: user.id,
      payload: { ...data, outletId: data.outletId || undefined },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="mb-6">
        <Field data-invalid={!!errors.role}>
          <FieldLabel>Role</FieldLabel>
          <Select
            value={roleValue ?? ''}
            onValueChange={(val) =>
              setValue('role', val as UpdateUserFormValues['role'])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.role]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="outletId">Outlet ID (optional)</FieldLabel>
          <Input
            id="outletId"
            placeholder="Outlet ID"
            {...register('outletId')}
          />
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="isActive"
            checked={isActiveValue ?? true}
            onCheckedChange={(checked) => setValue('isActive', !!checked)}
          />
          <FieldLabel htmlFor="isActive">Active</FieldLabel>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

// ─── Modal shell ──────────────────────────────────────────────────────────────

type CreateProps = {
  mode: 'create';
  user?: never;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};
type EditProps = {
  mode: 'edit';
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const UserFormModal = ({
  mode,
  user,
  open,
  onClose,
  onSuccess,
}: CreateProps | EditProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="container mx-auto">
      <DialogHeader>
        <DialogTitle>
          {mode === 'create' ? 'Create User' : 'Edit User'}
        </DialogTitle>
      </DialogHeader>
      {mode === 'create' ? (
        <CreateForm onClose={onClose} onSuccess={onSuccess} />
      ) : (
        <EditForm user={user} onClose={onClose} onSuccess={onSuccess} />
      )}
    </DialogContent>
  </Dialog>
);
