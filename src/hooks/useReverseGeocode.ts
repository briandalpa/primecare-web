import { useMutation } from '@tanstack/react-query';
import { reverseGeocode } from '@/services/reverseGeocode';

export function useReverseGeocode() {
  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) => reverseGeocode(lat, lng),
  });
}
