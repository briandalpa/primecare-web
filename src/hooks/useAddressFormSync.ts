import { useEffect, useMemo, useRef } from 'react';
import { useWatch, type Control, type UseFormReturn } from 'react-hook-form';
import type { Address, Province } from '@/types/address';
import { useCities } from '@/hooks/useRegions';

type FormValues = {
  label: string;
  street: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  phone: string;
};

const DEFAULT_VALUES: FormValues = {
  label: '',
  street: '',
  city: '',
  province: '',
  latitude: 0,
  longitude: 0,
  phone: '',
};

type Params = {
  open: boolean;
  editingAddress: Address | null;
  provinces: Province[];
  control: Control<FormValues>;
  reset: UseFormReturn<FormValues>['reset'];
};

export function useAddressFormSync({
  open,
  editingAddress,
  provinces,
  control,
  reset,
}: Params) {
  const hasReset = useRef(false);
  const watchedProvince = useWatch({ control, name: 'province' });

  const selectedProvinceId = useMemo(() => {
    if (!watchedProvince || !provinces.length) return null;
    return provinces.find((p) => p.name === watchedProvince)?.id ?? null;
  }, [watchedProvince, provinces]);

  const { data: cities = [], isLoading: citiesLoading } =
    useCities(selectedProvinceId);

  const sortedProvinces = useMemo(
    () => [...provinces].sort((a, b) => a.name.localeCompare(b.name)),
    [provinces],
  );
  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.name.localeCompare(b.name)),
    [cities],
  );

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
        phone: editingAddress.phone ?? '',
      });
    } else {
      reset(DEFAULT_VALUES);
    }

    hasReset.current = true;
  }, [open, editingAddress, reset]);

  return { selectedProvinceId, sortedProvinces, sortedCities, citiesLoading };
}
