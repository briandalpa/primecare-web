import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  outletFormSchema,
  type OutletFormSchemaInput,
  type OutletFormSchemaValues,
} from './outletFormSchema';
import type { Outlet } from '@/types/outlet';

type OutletFormProps = {
  initialValues?: Outlet;
  isPending: boolean;
  submitLabel: string;
  onSubmit: (values: OutletFormSchemaValues) => void;
};

export function OutletForm({
  initialValues,
  isPending,
  submitLabel,
  onSubmit,
}: OutletFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OutletFormSchemaInput, undefined, OutletFormSchemaValues>({
    resolver: zodResolver(outletFormSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      address: initialValues?.address ?? '',
      city: initialValues?.city ?? '',
      province: initialValues?.province ?? '',
      latitude: initialValues?.latitude ?? '',
      longitude: initialValues?.longitude ?? '',
      maxServiceRadiusKm: initialValues?.maxServiceRadiusKm ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.city}>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" {...register('city')} />
          <FieldError errors={[errors.city]} />
        </Field>

        <Field data-invalid={!!errors.address} className="md:col-span-2">
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input id="address" {...register('address')} />
          <FieldError errors={[errors.address]} />
        </Field>

        <Field data-invalid={!!errors.province}>
          <FieldLabel htmlFor="province">Province</FieldLabel>
          <Input id="province" {...register('province')} />
          <FieldError errors={[errors.province]} />
        </Field>

        <Field data-invalid={!!errors.maxServiceRadiusKm}>
          <FieldLabel htmlFor="maxServiceRadiusKm">Service Radius (km)</FieldLabel>
          <Input id="maxServiceRadiusKm" type="number" step="any" {...register('maxServiceRadiusKm')} />
          <FieldError errors={[errors.maxServiceRadiusKm]} />
        </Field>

        <Field data-invalid={!!errors.latitude}>
          <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
          <Input id="latitude" type="number" step="any" {...register('latitude')} />
          <FieldError errors={[errors.latitude]} />
        </Field>

        <Field data-invalid={!!errors.longitude}>
          <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
          <Input id="longitude" type="number" step="any" {...register('longitude')} />
          <FieldError errors={[errors.longitude]} />
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
