import { useEffect, useMemo, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { Address, Province } from '@/types/address';
import { useCities } from '@/hooks/useRegions';

type FormValues = {
  label: string;
  street: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_VALUES: FormValues = {
  label: '', street: '', city: '', province: '', latitude: 0, longitude: 0,
};

type Params = {
  open: boolean;
  editingAddress: Address | null;
  provinces: Province[];
  reset: UseFormReturn<FormValues>['reset'];
};

export function useAddressFormSync({ open, editingAddress, provinces, reset }: Params) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const hasReset = useRef(false);

  const { data: cities = [], isLoading: citiesLoading } = useCities(selectedProvinceId);

  const sortedProvinces = useMemo(() => [...provinces].sort((a, b) => a.name.localeCompare(b.name)), [provinces]);
  const sortedCities = useMemo(() => [...cities].sort((a, b) => a.name.localeCompare(b.name)), [cities]);

  useEffect(() => {
    if (!open) { hasReset.current = false; return; }
    if (hasReset.current) return;
    if (editingAddress) {
      reset({ label: editingAddress.label, street: editingAddress.street, city: editingAddress.city, province: editingAddress.province, latitude: editingAddress.latitude, longitude: editingAddress.longitude });
    } else {
      reset(DEFAULT_VALUES);
      setSelectedProvinceId(null);
    }
    hasReset.current = true;
  }, [open, editingAddress, reset]);

  useEffect(() => {
    if (!open || !editingAddress || !provinces.length) return;
    const matched = provinces.find(p => p.name === editingAddress.province);
    setSelectedProvinceId(matched?.id ?? null);
  }, [open, editingAddress, provinces]);

  return { selectedProvinceId, setSelectedProvinceId, sortedProvinces, sortedCities, citiesLoading };
}
