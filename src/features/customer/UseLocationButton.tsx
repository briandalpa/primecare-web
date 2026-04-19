import { useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReverseGeocode } from '@/hooks/useReverseGeocode';
import type { GeolocationCoords, GeolocationStatus, ReverseGeocodeResult } from '@/types/geolocation';

export type LocatedPayload = {
  coords: GeolocationCoords;
  geocode: ReverseGeocodeResult | null;
};

type Props = {
  onLocated: (data: LocatedPayload) => void;
  disabled?: boolean;
};

function getLabel(status: GeolocationStatus, isPending: boolean): string {
  if (status === 'pending') return 'Getting location...';
  if (isPending) return 'Identifying area...';
  if (status === 'denied') return 'Location access denied';
  if (status === 'unavailable') return 'Location not supported';
  if (status === 'error') return 'Location failed — tap to retry';
  return 'Use my current location';
}

export function UseLocationButton({ onLocated, disabled }: Props) {
  const { coords, status, requestLocation } = useGeolocation();
  const { mutate, isPending } = useReverseGeocode();
  const pendingMutate = useRef(false);

  const runMutate = useCallback((c: GeolocationCoords) => {
    mutate(
      { lat: c.latitude, lng: c.longitude },
      {
        onSuccess: (geocode) => onLocated({ coords: c, geocode }),
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.status === 422) {
            onLocated({ coords: c, geocode: null });
            return;
          }
          toast.error('Something went wrong. Please try again.');
        },
      },
    );
  }, [mutate, onLocated]);

  useEffect(() => {
    if (!pendingMutate.current || status !== 'granted' || !coords) return;
    pendingMutate.current = false;
    runMutate(coords);
  }, [status, coords, runMutate]);

  const handleClick = () => {
    if (status === 'granted' && coords) { runMutate(coords); return; }
    pendingMutate.current = true;
    requestLocation();
  };

  const isLoading = status === 'pending' || isPending;
  const isDenied = status === 'denied';
  const isUnavailable = status === 'unavailable';
  const isError = status === 'error';
  const isDisabled = disabled || isDenied || isUnavailable || isLoading;
  const label = getLabel(status, isPending);

  return (
    <div className="mb-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          'gap-2 text-sm',
          isDenied || isUnavailable
            ? 'text-muted-foreground'
            : 'text-primary border-primary/40 hover:bg-primary/5',
        )}
      >
        {isLoading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <MapPin className="h-4 w-4" />}
        {label}
      </Button>
      {isDenied && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Enable location access in your browser settings.
        </p>
      )}
      {isError && (
        <p className="mt-1.5 text-xs text-destructive">
          Could not get your location. Please try again.
        </p>
      )}
    </div>
  );
}
