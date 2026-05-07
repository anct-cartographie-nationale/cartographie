import type { BBox } from 'geojson';
import type { FiltersSchema } from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux, getOpeningHoursCache, needsOpeningHoursCache } from '@/libraries/lieux-cache';
import { MAP_CHUNK_OPTIONS, mapChunk, type Position2D } from '@/libraries/map';

export const fetchLieuxForChunkServer = async (position: Position2D, filters: FiltersSchema) => {
  const [minLon, minLat, maxLon, maxLat]: BBox = mapChunk(position, MAP_CHUNK_OPTIONS);
  const [allLieux, ohCache] = await Promise.all([
    getAllLieux(),
    needsOpeningHoursCache(filters) ? getOpeningHoursCache() : undefined
  ]);

  const chunkLieux = allLieux.filter(
    (lieu) =>
      lieu.latitude != null &&
      lieu.longitude != null &&
      lieu.latitude > minLat &&
      lieu.latitude <= maxLat &&
      lieu.longitude > minLon &&
      lieu.longitude <= maxLon
  );

  return filterLieux(chunkLieux, filters, undefined, ohCache).map(({ id, nom, latitude, longitude }) => ({
    id,
    nom,
    latitude,
    longitude
  }));
};
