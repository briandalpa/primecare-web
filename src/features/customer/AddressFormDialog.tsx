import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Address } from '@/types/address';
import { useCreateAddress, useUpdateAddress } from '@/hooks/useAddresses';
import { useProvinces, useCities, useGeocode } from '@/hooks/useRegions';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';

const addressSchema = z.object({
  label: z.string().trim().min(1, 'Label is required').max(50),
  street: z.string().trim().min(1, 'Street is required').max(255),
  city: z.string().trim().min(1, 'City is required'),
  province: z.string().trim().min(1, 'Province is required'),
  latitude: z.number(),
  longitude: z.number(),
});

type FormValues = z.infer<typeof addressSchema>;

const defaultValues: FormValues = {
  label: '',
  street: '',
  city: '',
  province: '',
  latitude: 0,
  longitude: 0,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAddress: Address | null;
};

export function AddressFormDialog({ open, onOpenChange, editingAddress }: Props) {
  const create = useCreateAddress();
  const update = useUpdateAddress();
  const isPending = create.isPending || update.isPending;

  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const hasReset = useRef(false);

  const { data: provinces = [], isLoading: provincesLoading } = useProvinces();
  const { data: cities = [], isLoading: citiesLoading } = useCities(selectedProvinceId);

  const sortedProvinces = useMemo(
    () => [...provinces].sort((a, b) => a.name.localeCompare(b.name)),
    [provinces],
  );
  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.name.localeCompare(b.name)),
    [cities],
  );

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const watchedCity = watch('city');
  const watchedProvince = watch('province');

  const { data: geocodeData } = useGeocode(watchedCity, watchedProvince);

  useEffect(() => {
    if (geocodeData) {
      setValue('latitude', geocodeData.latitude);
      setValue('longitude', geocodeData.longitude);
    }
  }, [geocodeData, setValue]);

  useEffect(() => {
    if (!open) {
      hasReset.current = false;
      return;
    }
    if (hasReset.current) return;
    if (editingAddress) {
      reset({
        label: editingAddress.label,
        street: editingAddress.street,
        city: editingAddress.city,
        province: editingAddress.province,
        latitude: editingAddress.latitude,
        longitude: editingAddress.longitude,
      });
      const matched = provinces.find(p => p.name === editingAddress.province);
      setSelectedProvinceId(matched?.id ?? null);
    } else {
      reset(defaultValues);
      setSelectedProvinceId(null);
    }
    hasReset.current = true;
  }, [open, editingAddress, provinces, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingAddress) {
        await update.mutateAsync({ id: editingAddress.id, payload: values });
        toast.success('Address updated');
      } else {
        await create.mutateAsync(values);
        toast.success('Address added');
      }
      onOpenChange(false);
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="mb-4">
            <Field>
              <FieldLabel htmlFor="label">Label</FieldLabel>
              <Input id="label" placeholder="Home, Work, etc." {...register('label')} />
              <FieldError errors={[errors.label]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="street">Street Address</FieldLabel>
              <Input id="street" placeholder="Jl. Mawar No. 12" {...register('street')} />
              <FieldError errors={[errors.street]} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Province</FieldLabel>
                <Select
                  disabled={provincesLoading}
                  value={watchedProvince}
                  onValueChange={(name) => {
                    const province = provinces.find(p => p.name === name);
                    setValue('province', name);
                    setValue('city', '');
                    setSelectedProvinceId(province?.id ?? null);
                  }}
                >
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder={provincesLoading ? 'Loading...' : 'Select province'} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedProvinces.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.province]} />
              </Field>
              <Field>
                <FieldLabel>City</FieldLabel>
                <Select
                  disabled={!selectedProvinceId || citiesLoading}
                  value={watchedCity}
                  onValueChange={(name) => setValue('city', name)}
                >
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder={
                      !selectedProvinceId ? 'Select province first' :
                      citiesLoading ? 'Loading...' : 'Select city'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedCities.map(c => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.city]} />
              </Field>
            </div>
          </FieldGroup>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-full px-6" disabled={isPending}>
              {editingAddress ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
