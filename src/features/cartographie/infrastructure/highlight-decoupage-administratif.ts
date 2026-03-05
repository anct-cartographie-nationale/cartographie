import type { Map as MapLibreMap } from 'maplibre-gl';
import { addHighlightLayers, getThemeColors, removeHighlightLayers } from '@/libraries/map';

const SOURCE = 'decoupage-administratif';

export const SourceLayer = {
  regions: 'regions',
  departements: 'departements',
  communes: 'communes'
} as const;

export const removeHighlightDecoupageAdministratif = (map: MapLibreMap) => {
  removeHighlightLayers(map, Object.values(SourceLayer));
};

export const highlightDecoupageAdministratif = (
  map: MapLibreMap,
  { code, sourceLayer }: { code: string; sourceLayer: keyof typeof SourceLayer }
) => {
  removeHighlightDecoupageAdministratif(map);
  const colors = getThemeColors();

  addHighlightLayers(map, {
    source: SOURCE,
    sourceLayer,
    filterProperty: 'code',
    filterValue: code,
    fillColor: colors.primary,
    fillOpacity: 0.06,
    borderColor: colors.primary,
    borderBackgroundColor: colors.background,
    borderWidth: 3
  });
};

export const HighlightRegion = (map: MapLibreMap, code: string) =>
  highlightDecoupageAdministratif(map, { sourceLayer: SourceLayer.regions, code });

export const HighlightCommune = (map: MapLibreMap, code: string) =>
  highlightDecoupageAdministratif(map, { sourceLayer: SourceLayer.communes, code });
