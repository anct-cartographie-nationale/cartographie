'use client';

export const useMapLocation = () => {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem('mapLocation');

  if (raw == null) return null;

  const location = JSON.parse(raw) as { zoom: number; lng: number; lat: number };

  return {
    zoom: location.zoom,
    longitude: location.lng,
    latitude: location.lat
  };
};
