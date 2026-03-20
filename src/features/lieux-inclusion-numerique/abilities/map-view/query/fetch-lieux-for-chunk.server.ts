import type { BBox } from 'geojson';
import { applyFilters, type FiltersSchema, inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/libraries/inclusion-numerique-api';
import { MAP_CHUNK_OPTIONS, mapChunk, type Position2D } from '@/libraries/map';

export const fetchLieuxForChunkServer = async (position: Position2D, filters: FiltersSchema) => {
  const [minLon, minLat, maxLon, maxLat]: BBox = mapChunk(position, MAP_CHUNK_OPTIONS);

  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    select: ['id', 'nom', 'latitude', 'longitude'],
    filter: {
      latitude: [`gt.${minLat}`, `lte.${maxLat}`],
      longitude: [`gt.${minLon}`, `lte.${maxLon}`],
      ...applyFilters(filters)
    }
  });

  return lieux;
};
