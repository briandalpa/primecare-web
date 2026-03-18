import { useQuery } from '@tanstack/react-query'
import { getProvinces, getCitiesByProvince, geocodeAddress } from '@/services/region'
import { toTitleCase } from '@/utils/string'

export function useProvinces() {
  return useQuery({
    queryKey: ['regions', 'provinces'],
    queryFn: getProvinces,
    staleTime: Infinity,
    select: (data) => data.map(p => ({ ...p, name: toTitleCase(p.name) })),
  })
}

export function useCities(provinceId: number | null) {
  return useQuery({
    queryKey: ['regions', 'cities', provinceId],
    queryFn: () => getCitiesByProvince(provinceId!),
    enabled: provinceId !== null,
    staleTime: Infinity,
    select: (data) => data.map(c => ({ ...c, name: toTitleCase(c.name) })),
  })
}

export function useGeocode(city: string, province: string) {
  return useQuery({
    queryKey: ['geocode', city, province],
    queryFn: () => geocodeAddress(city, province),
    enabled: !!city && !!province,
    staleTime: Infinity,
  })
}
