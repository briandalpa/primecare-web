import { axiosInstance } from '@/lib/axiosInstance';
import type { ReverseGeocodeResult } from '@/types/geolocation';

export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  const res = await axiosInstance.get<{ data: ReverseGeocodeResult }>('/api/v1/regions/reverse-geocode', {
    params: { lat, lng },
  });
  return res.data.data;
}
