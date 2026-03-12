'use client';

type MapLocation = { zoom: number; lng: number; lat: number };

const STORAGE_KEY = 'mapLocation';

const getStoredLocation = (): MapLocation | null => {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as MapLocation) : null;
};

export const invalidateMapLocationIfChanged = (config: { zoom?: number; latitude?: number; longitude?: number }): void => {
  if (typeof window === 'undefined') return;
  if (config.zoom == null && config.latitude == null && config.longitude == null) return;

  const stored = getStoredLocation();
  if (!stored) return;

  const hasChanged =
    (config.zoom != null && config.zoom !== stored.zoom) ||
    (config.latitude != null && config.latitude !== stored.lat) ||
    (config.longitude != null && config.longitude !== stored.lng);

  if (hasChanged) {
    sessionStorage.removeItem(STORAGE_KEY);
  }
};

export const useMapLocation = () => {
  const location = getStoredLocation();

  return location
    ? {
        zoom: location.zoom,
        longitude: location.lng,
        latitude: location.lat
      }
    : null;
};
