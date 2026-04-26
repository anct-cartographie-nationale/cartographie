'use client';

import { france } from '@/libraries/collectivites';
import { inject } from '@/libraries/injection';
import { map$, setZoom } from '@/libraries/map';
import { useTap } from '@/libraries/reactivity/Subscribe';
import { MAP_CONFIG } from '@/shared/injection';
import { removeHighlightDecoupageAdministratif } from '@/shared/ui/highlight-decoupage-administratif';

const defaultConfig = france.find(({ nom }): boolean => nom === 'France métropolitaine');

export const useMapInitialLocation = () => {
  const customLocation = inject(MAP_CONFIG);
  const customZoom = customLocation.zoom;
  const isCustomZoomValid = customZoom != null && defaultConfig && customZoom > defaultConfig.zoom;

  const initialLocation = defaultConfig
    ? {
        zoom: isCustomZoomValid ? customZoom : defaultConfig.zoom,
        latitude: customLocation.latitude ?? defaultConfig.localisation.latitude,
        longitude: customLocation.longitude ?? defaultConfig.localisation.longitude
      }
    : null;

  useTap(map$, (map) => {
    if (!initialLocation) return;
    setZoom(initialLocation.zoom);
    if (!map) return;
    map.flyTo({
      center: [initialLocation.longitude, initialLocation.latitude],
      zoom: initialLocation.zoom,
      duration: 400
    });
    if (!map.isStyleLoaded()) return;
    removeHighlightDecoupageAdministratif(map);
  });
};
