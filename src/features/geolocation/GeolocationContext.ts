import { createContext, useContext } from 'react';
import type { GeolocationCoords, GeolocationStatus } from '@/types/geolocation';

export interface GeolocationContextValue {
  coords: GeolocationCoords | null;
  status: GeolocationStatus;
  requestLocation: () => void;
}

export const GeolocationContext = createContext<GeolocationContextValue>({
  coords: null,
  status: 'idle',
  requestLocation: () => {},
});

export function useGeolocationContext() {
  return useContext(GeolocationContext);
}
