import { useCallback, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Address } from '@/types/address';
import { useCreateAddress, useUpdateAddress } from '@/hooks/useAddresses';
import { useProvinces, useGeocode } from '@/hooks/useRegions';
import { toTitleCase } from '@/utils/string';
import { useAddressFormSync } from '@/hooks/useAddressFormSync';
import {
  UseLocationButton,
  type LocatedPayload,
} from '@/features/customer/UseLocationButton';
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
  latitude: z
    .number()
    .refine((n) => n !== 0, {
      message: 'Location could not be determined. Please select a city.',
    }),
  longitude: z
    .number()
    .refine((n) => n !== 0, {
      message: 'Location could not be determined. Please select a city.',
    }),
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

export function AddressFormDialog({
  open,
  onOpenChange,
  editingAddress,
}: Props) {
  const create = useCreateAddress();
  const update = useUpdateAddress();
  const mutationPending = create.isPending || update.isPending;

  const { data: provinces = [], isLoading: provincesLoading } = useProvinces();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const watchedCity = useWatch({ control, name: 'city' });
  const watchedProvince = useWatch({ control, name: 'province' });

  const { selectedProvinceId, sortedProvinces, sortedCities, citiesLoading } =
    useAddressFormSync({
      open,
      editingAddress,
      provinces,
      control,
      reset,
    });

  const { data: geocodeData, isFetching: geocodeFetching } = useGeocode(
    watchedCity,
    watchedProvince,
  );
  const isPending = mutationPending || geocodeFetching;

  const pendingCityRef = useRef<string | null>(null);

  useEffect(() => {
    if (geocodeData) {
      setValue('latitude', geocodeData.latitude);
      setValue('longitude', geocodeData.longitude);
    }
  }, [geocodeData, setValue]);

  useEffect(() => {
    if (!open) pendingCityRef.current = null;
  }, [open]);

  useEffect(() => {
    if (!pendingCityRef.current || citiesLoading || !sortedCities.length)
      return;
    const match = sortedCities.find((c) => c.name === pendingCityRef.current);
    if (match) {
      setValue('city', match.name);
      void trigger(['city']);
    }
    pendingCityRef.current = null;
  }, [sortedCities, citiesLoading, setValue, trigger]);

  const handleLocated = useCallback(
    ({ coords, geocode }: LocatedPayload) => {
      setValue('latitude', coords.latitude);
      setValue('longitude', coords.longitude);
      if (!geocode) {
        toast.error(
          "We couldn't identify your area — please select province and city manually.",
        );
        return;
      }
      setValue('province', toTitleCase(geocode.province));
      pendingCityRef.current = toTitleCase(geocode.city);
      if (geocode.streetAddress) setValue('street', geocode.streetAddress);
      void trigger(['province', 'street', 'latitude', 'longitude']);
    },
    [setValue, trigger],
  );

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
          <UseLocationButton onLocated={handleLocated} disabled={isPending} />
          <FieldGroup className="mb-4">
            <Field>
              <FieldLabel htmlFor="label">Label</FieldLabel>
              <Input
                id="label"
                placeholder="Home, Work, etc."
                {...register('label')}
              />
              <FieldError errors={[errors.label]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="street">Street Address</FieldLabel>
              <Input
                id="street"
                placeholder="Jl. Mawar No. 12"
                {...register('street')}
              />
              <FieldError errors={[errors.street]} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Province</FieldLabel>
                <Select
                  disabled={provincesLoading}
                  value={watchedProvince}
                  onValueChange={(name) => {
                    setValue('province', name);
                    setValue('city', '');
                  }}
                >
                  <SelectTrigger className="capitalize">
                    <SelectValue
                      placeholder={
                        provincesLoading ? 'Loading...' : 'Select province'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedProvinces.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
                      </SelectItem>
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
                    <SelectValue
                      placeholder={
                        !selectedProvinceId
                          ? 'Select province first'
                          : citiesLoading
                          ? 'Loading...'
                          : 'Select city'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedCities.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.city]} />
              </Field>
            </div>
          </FieldGroup>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full px-6"
              disabled={isPending}
            >
              {editingAddress ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
