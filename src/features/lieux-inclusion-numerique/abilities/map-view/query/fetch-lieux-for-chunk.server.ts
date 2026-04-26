import type { BBox } from 'geojson';
import type { FiltersSchema } from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux } from '@/libraries/lieux-cache';
import { MAP_CHUNK_OPTIONS, mapChunk, type Position2D } from '@/libraries/map';

export const fetchLieuxForChunkServer = async (position: Position2D, filters: FiltersSchema) => {
  const [minLon, minLat, maxLon, maxLat]: BBox = mapChunk(position, MAP_CHUNK_OPTIONS);
  const allLieux = await getAllLieux();

  return filterLieux(allLieux, filters)
    .filter(
      (lieu) =>
        lieu.latitude != null &&
        lieu.longitude != null &&
        lieu.latitude > minLat &&
        lieu.latitude <= maxLat &&
        lieu.longitude > minLon &&
        lieu.longitude <= maxLon
    )
    .map(({ id, nom, latitude, longitude }) => ({ id, nom, latitude, longitude }));
};
