import type { Map as MapLibreMap } from 'maplibre-gl';

export const SourceLayer = {
  regions: 'regions',
  departements: 'departements',
  communes: 'communes'
} as const;

export const removeHighlightDecoupageAdministratif = (map: MapLibreMap) => {
  Object.values(SourceLayer).forEach((sourceLayer) => {
    if (map.getLayer(`${sourceLayer}-selectionnee-fill`)) {
      map.removeLayer(`${sourceLayer}-selectionnee-fill`);
    }

    if (map.getLayer(`${sourceLayer}-selectionnee-border-background`)) {
      map.removeLayer(`${sourceLayer}-selectionnee-border-background`);
    }

    if (map.getLayer(`${sourceLayer}-selectionnee-border`)) {
      map.removeLayer(`${sourceLayer}-selectionnee-border`);
    }
  });
};

export const highlightDecoupageAdministratif = (
  map: MapLibreMap,
  { code, sourceLayer }: { code: string; sourceLayer: keyof typeof SourceLayer }
) => {
  removeHighlightDecoupageAdministratif(map);
  map.addLayer({
    id: `${sourceLayer}-selectionnee-fill`,
    type: 'fill',
    source: 'decoupage-administratif',
    'source-layer': sourceLayer,
    filter: ['==', 'code', code],
    paint: {
      'fill-color': getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
      'fill-opacity': 0.06
    }
  });
  map.addLayer({
    id: `${sourceLayer}-selectionnee-border-background`,
    type: 'line',
    source: 'decoupage-administratif',
    'source-layer': sourceLayer,
    filter: ['all', ['==', 'code', code]],
    paint: {
      'line-color': getComputedStyle(document.documentElement).getPropertyValue('--color-base-100').trim(),
      'line-width': 5
    }
  });
  map.addLayer({
    id: `${sourceLayer}-selectionnee-border`,
    type: 'line',
    source: 'decoupage-administratif',
    'source-layer': sourceLayer,
    filter: ['==', 'code', code],
    paint: {
      'line-color': getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
      'line-width': 3
    }
  });
};

export const HighlightRegion = (map: MapLibreMap, code: string) =>
  highlightDecoupageAdministratif(map, {
    sourceLayer: SourceLayer.regions,
    code
  });

export const HighlightDepartement = (map: MapLibreMap, code: string) =>
  highlightDecoupageAdministratif(map, {
    sourceLayer: SourceLayer.departements,
    code
  });

export const HighlightCommune = (map: MapLibreMap, code: string) =>
  highlightDecoupageAdministratif(map, {
    sourceLayer: SourceLayer.communes,
    code
  });
