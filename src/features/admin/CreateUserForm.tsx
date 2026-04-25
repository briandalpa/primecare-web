import { useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useAdminOutlets } from '@/hooks/useAdminOutlets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createUserSchema,
  type CreateUserFormValues,
} from './userFormSchema';

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

type CreateUserFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateUserForm({ onClose, onSuccess }: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'WORKER',
      outletId: undefined,
      workerType: undefined,
    },
  });

  const roleValue = useWatch({ control, name: 'role' });
  const needsOutlet = roleValue === 'WORKER' || roleValue === 'DRIVER';
  const submitLockRef = useRef(false);
  const { mutateAsync, isPending } = useCreateUser(async () => {
    await onSuccess();
    onClose();
  });
  const { data: outletsData, isLoading: outletsLoading } = useAdminOutlets({
    isActive: true,
    limit: 100,
  });
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
          <Input id="email" type="email" placeholder="email@example.com" {...register('email')} />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            {...register('password')}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Field data-invalid={!!errors.role}>
          <FieldLabel>Role</FieldLabel>
          <Select
            value={roleValue}
            onValueChange={(val) => {
              setValue('role', val as CreateUserFormValues['role']);
              setValue('outletId', undefined);
              setValue('workerType', undefined);
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
            <Select onValueChange={(val) => setValue('outletId', val)} disabled={outletsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={outletsLoading ? 'Loading outlets...' : 'Select outlet'} />
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
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
