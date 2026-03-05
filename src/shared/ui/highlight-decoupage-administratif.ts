import type { Map as MapLibreMap } from 'maplibre-gl';
import { inject } from '@/libraries/injection';
import { addHighlightLayers, removeHighlightLayers, THEME_COLORS } from '@/libraries/map';

const SOURCE = 'decoupage-administratif';

export const SourceLayer = {
  regions: 'regions',
  departements: 'departements',
  communes: 'communes'
} as const;

export const removeHighlightDecoupageAdministratif = (map: MapLibreMap) => {
  removeHighlightLayers(map, Object.values(SourceLayer));
};

const highlightDecoupageAdministratif = (
  map: MapLibreMap,
  { code, sourceLayer }: { code: string; sourceLayer: keyof typeof SourceLayer }
) => {
  removeHighlightDecoupageAdministratif(map);
  const colors = inject(THEME_COLORS)();

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

export const highlightRegion = (map: MapLibreMap, code: string) =>
  highlightDecoupageAdministratif(map, { sourceLayer: SourceLayer.regions, code });

export const highlightDepartement = (map: MapLibreMap, code: string) =>
  highlightDecoupageAdministratif(map, { sourceLayer: SourceLayer.departements, code });

export const highlightCommune = (map: MapLibreMap, code: string) =>
  highlightDecoupageAdministratif(map, { sourceLayer: SourceLayer.communes, code });
