import { useCallback, useState } from 'react';
import type { GeolocationCoords, GeolocationStatus } from '@/types/geolocation';
import { GeolocationContext } from './GeolocationContext';

export default function GeolocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>('idle');

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setStatus('unavailable'); return; }
    setStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatus('granted');
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
      },
    );
  }, []);

  return (
    <GeolocationContext.Provider value={{ coords, status, requestLocation }}>
      {children}
    </GeolocationContext.Provider>
  );
}
