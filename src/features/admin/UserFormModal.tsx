import { useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { useAdminOutlets } from '@/hooks/useAdminOutlets';
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
  DialogDescription,
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

const WORKER_TYPE_OPTIONS = [
  { value: 'WASHING', label: 'Washing' },
  { value: 'IRONING', label: 'Ironing' },
  { value: 'PACKING', label: 'Packing' },
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
    defaultValues: { name: '', email: '', role: 'WORKER', outletId: undefined, workerType: undefined },
  });

  const roleValue = useWatch({ control, name: 'role' });
  const needsOutlet = roleValue === 'WORKER' || roleValue === 'DRIVER';
  const submitLockRef = useRef(false);
  const { mutateAsync, isPending } = useCreateUser(async () => {
    await onSuccess();
    onClose();
  });

  const { data: outletsData, isLoading: outletsLoading } = useAdminOutlets(
    needsOutlet ? { isActive: true, limit: 100 } : { isActive: true, limit: 100 },
  );
  const outlets = outletsData?.data ?? [];

  const onSubmit = async (data: CreateUserFormValues) => {
    if (submitLockRef.current || isPending) return;

    submitLockRef.current = true;

    try {
      await mutateAsync({ ...data, outletId: data.outletId || undefined });
    } finally {
      submitLockRef.current = false;
    }
  };

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
            onValueChange={(val) => {
              setValue('role', val as CreateUserFormValues['role']);
              setValue('outletId', undefined);
            }}
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

        {roleValue === 'WORKER' && (
          <Field data-invalid={!!errors.workerType}>
            <FieldLabel>Worker Type</FieldLabel>
            <Select
              onValueChange={(val) =>
                setValue('workerType', val as CreateUserFormValues['workerType'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select worker type" />
              </SelectTrigger>
              <SelectContent>
                {WORKER_TYPE_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[errors.workerType]} />
          </Field>
        )}

        {needsOutlet && (
          <Field data-invalid={!!errors.outletId}>
            <FieldLabel>Outlet</FieldLabel>
            <Select
              onValueChange={(val) => setValue('outletId', val)}
              disabled={outletsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={outletsLoading ? 'Loading outlets…' : 'Select outlet'} />
              </SelectTrigger>
              <SelectContent>
                {outlets.map((outlet) => (
                  <SelectItem key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[errors.outletId]} />
          </Field>
        )}
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
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      role: user.role as UpdateUserFormValues['role'],
      outletId: user.outlet?.id ?? undefined,
      isActive: true,
      workerType: (user.workerType as UpdateUserFormValues['workerType']) ?? undefined,
    },
  });

  const roleValue = useWatch({ control, name: 'role' });
  const outletIdValue = useWatch({ control, name: 'outletId' });
  const isActiveValue = useWatch({ control, name: 'isActive' });
  const workerTypeValue = useWatch({ control, name: 'workerType' });
  const needsOutlet = roleValue === 'WORKER' || roleValue === 'DRIVER';
  const submitLockRef = useRef(false);
  const { mutateAsync, isPending } = useUpdateUser(async () => {
    await onSuccess();
    onClose();
  });

  const { data: outletsData, isLoading: outletsLoading } = useAdminOutlets({
    isActive: true,
    limit: 100,
  });
  const outlets = outletsData?.data ?? [];

  const onSubmit = async (data: UpdateUserFormValues) => {
    if (submitLockRef.current || isPending) return;

    submitLockRef.current = true;

    try {
      await mutateAsync({
        userId: user.id,
        payload: { ...data, outletId: data.outletId || undefined },
      });
    } finally {
      submitLockRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="mb-6">
        <Field data-invalid={!!errors.role}>
          <FieldLabel>Role</FieldLabel>
          <Select
            value={roleValue ?? ''}
            onValueChange={(val) => {
              setValue('role', val as UpdateUserFormValues['role']);
              setValue('outletId', undefined);
            }}
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

        {roleValue === 'WORKER' && (
          <Field data-invalid={!!errors.workerType}>
            <FieldLabel>Worker Type</FieldLabel>
            <Select
              value={workerTypeValue ?? ''}
              onValueChange={(val) =>
                setValue('workerType', val as UpdateUserFormValues['workerType'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select worker type" />
              </SelectTrigger>
              <SelectContent>
                {WORKER_TYPE_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[errors.workerType]} />
          </Field>
        )}

        {needsOutlet && (
          <Field data-invalid={!!errors.outletId}>
            <FieldLabel>Outlet</FieldLabel>
            <Select
              value={outletIdValue ?? ''}
              onValueChange={(val) => setValue('outletId', val)}
              disabled={outletsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={outletsLoading ? 'Loading outlets…' : 'Select outlet'} />
              </SelectTrigger>
              <SelectContent>
                {outlets.map((outlet) => (
                  <SelectItem key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[errors.outletId]} />
          </Field>
        )}

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
        <DialogDescription>
          {mode === 'create'
            ? 'Add a staff account and send an invite email.'
            : 'Update the selected staff account.'}
        </DialogDescription>
      </DialogHeader>
      {mode === 'create' ? (
        <CreateForm onClose={onClose} onSuccess={onSuccess} />
      ) : (
        <EditForm user={user} onClose={onClose} onSuccess={onSuccess} />
      )}
    </DialogContent>
  </Dialog>
);
