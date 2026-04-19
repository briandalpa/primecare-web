export type GeolocationStatus =
  | 'idle'
  | 'pending'
  | 'granted'
  | 'denied'
  | 'error'
  | 'unavailable';

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export interface ReverseGeocodeResult {
  province: string;
  provinceId: number;
  city: string;
  cityId: number;
  streetAddress: string | null;
}
