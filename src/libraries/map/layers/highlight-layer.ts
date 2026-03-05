import type { Map as MapLibreMap } from 'maplibre-gl';

export type HighlightLayerConfig = {
  source: string;
  sourceLayer: string;
  filterProperty: string;
  filterValue: string;
  fillColor: string;
  fillOpacity: number;
  borderColor: string;
  borderBackgroundColor: string;
  borderWidth: number;
};

const layerIds = (sourceLayer: string) => ({
  fill: `${sourceLayer}-highlight-fill`,
  borderBackground: `${sourceLayer}-highlight-border-background`,
  border: `${sourceLayer}-highlight-border`
});

export const removeHighlightLayers = (map: MapLibreMap, sourceLayers: string[]) => {
  sourceLayers.forEach((sourceLayer) => {
    const ids = layerIds(sourceLayer);
    if (map.getLayer(ids.fill)) map.removeLayer(ids.fill);
    if (map.getLayer(ids.borderBackground)) map.removeLayer(ids.borderBackground);
    if (map.getLayer(ids.border)) map.removeLayer(ids.border);
  });
};

export const addHighlightLayers = (map: MapLibreMap, config: HighlightLayerConfig) => {
  const ids = layerIds(config.sourceLayer);

  map.addLayer({
    id: ids.fill,
    type: 'fill',
    source: config.source,
    'source-layer': config.sourceLayer,
    filter: ['==', config.filterProperty, config.filterValue],
    paint: {
      'fill-color': config.fillColor,
      'fill-opacity': config.fillOpacity
    }
  });

  map.addLayer({
    id: ids.borderBackground,
    type: 'line',
    source: config.source,
    'source-layer': config.sourceLayer,
    filter: ['==', config.filterProperty, config.filterValue],
    paint: {
      'line-color': config.borderBackgroundColor,
      'line-width': config.borderWidth + 2
    }
  });

  map.addLayer({
    id: ids.border,
    type: 'line',
    source: config.source,
    'source-layer': config.sourceLayer,
    filter: ['==', config.filterProperty, config.filterValue],
    paint: {
      'line-color': config.borderColor,
      'line-width': config.borderWidth
    }
  });
};
