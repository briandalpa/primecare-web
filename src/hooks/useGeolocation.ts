import { useGeolocationContext } from '@/features/geolocation/GeolocationContext';

export function useGeolocation() {
  return useGeolocationContext();
}
