import type { Map as MapLibreMap } from 'maplibre-gl';
import { addHighlightLayers, getThemeColors, removeHighlightLayers } from '@/libraries/map';

const SOURCE = 'decoupage-administratif';
const SOURCE_LAYER = 'departements';

export const removeHighlightDepartement = (map: MapLibreMap) => {
  removeHighlightLayers(map, [SOURCE_LAYER]);
};

export const highlightDepartement = (map: MapLibreMap, code: string) => {
  removeHighlightDepartement(map);
  const colors = getThemeColors();

  addHighlightLayers(map, {
    source: SOURCE,
    sourceLayer: SOURCE_LAYER,
    filterProperty: 'code',
    filterValue: code,
    fillColor: colors.primary,
    fillOpacity: 0.06,
    borderColor: colors.primary,
    borderBackgroundColor: colors.background,
    borderWidth: 3
  });
};
