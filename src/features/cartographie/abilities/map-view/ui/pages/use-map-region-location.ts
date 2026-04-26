'use client';

import type { Region } from '@/libraries/collectivites';
import { inject } from '@/libraries/injection';
import { map$, setZoom } from '@/libraries/map';
import { useTap } from '@/libraries/reactivity/Subscribe';
import { MAP_CONFIG } from '@/shared/injection';
import { highlightRegion } from '@/shared/ui/highlight-decoupage-administratif';

export const useMapRegionLocation = (region: Region) => {
  const customLocation = inject(MAP_CONFIG);
  const customZoom = customLocation.zoom;
  const isCustomZoomValid = customZoom != null && customZoom > region.zoom;

  const initialLocation = {
    zoom: isCustomZoomValid ? customZoom : region.zoom,
    latitude: customLocation.latitude ?? region.localisation.latitude,
    longitude: customLocation.longitude ?? region.localisation.longitude
  };

  useTap(map$, (map) => {
    setZoom(initialLocation.zoom);
    if (!map) return;
    map.flyTo({
      center: [initialLocation.longitude, initialLocation.latitude],
      zoom: initialLocation.zoom,
      duration: 400
    });
    if (!map.isStyleLoaded()) return;
    highlightRegion(map, region.code);
  });
};
