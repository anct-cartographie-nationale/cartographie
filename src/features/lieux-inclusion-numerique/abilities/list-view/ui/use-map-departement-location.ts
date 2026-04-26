'use client';

import type { Departement } from '@/libraries/collectivites';
import { inject } from '@/libraries/injection';
import { map$, setZoom, useMapLocation } from '@/libraries/map';
import { useTap } from '@/libraries/reactivity/Subscribe';
import { MAP_CONFIG, TERRITOIRE_FILTER } from '@/shared/injection';
import { highlightDepartement } from '@/shared/ui/highlight-decoupage-administratif';

export const useMapDepartementLocation = (departement: Departement) => {
  const location = useMapLocation();
  const customLocation = inject(MAP_CONFIG);
  const territoireFilter = inject(TERRITOIRE_FILTER);

  const isRegionFilter = territoireFilter.type === 'regions';
  const customZoom = customLocation.zoom;
  const isCustomZoomValid = !isRegionFilter && customZoom != null && customZoom > departement.zoom;

  const defaultLocation = {
    zoom: isCustomZoomValid ? customZoom : departement.zoom,
    latitude: isRegionFilter
      ? departement.localisation.latitude
      : (customLocation.latitude ?? departement.localisation.latitude),
    longitude: isRegionFilter
      ? departement.localisation.longitude
      : (customLocation.longitude ?? departement.localisation.longitude)
  };

  const initialLocation = (location?.zoom ?? 0) > 9 ? { ...defaultLocation, ...location } : defaultLocation;

  useTap(map$, (map) => {
    setZoom(initialLocation.zoom);
    if (!map) return;
    map.flyTo({
      center: [initialLocation.longitude, initialLocation.latitude],
      zoom: initialLocation.zoom,
      duration: 400
    });
    if (!map.isStyleLoaded()) return;
    highlightDepartement(map, departement.code);
  });
};
