import { inject } from '@/libraries/injection';
import type { Position2D } from '../../geo';
import type { Lieu } from '../domain/lieu';
import type { LieuxForChunk } from '../domain/lieux-for-chunk';
import { LIEUX_CACHE } from '../lieux-cache.key';

export const fetchLieuxForChunk: LieuxForChunk = async (
  position: Position2D,
  searchParams: URLSearchParams
): Promise<Lieu[]> => {
  const [longitude, latitude] = position;
  const filtersParams = searchParams.size > 0 ? `&${searchParams.toString()}` : '';
  const queryParams = `latitude=${latitude}&longitude=${longitude}${filtersParams}`;

  const lieuxCache = inject(LIEUX_CACHE);

  if (lieuxCache.has(queryParams)) return lieuxCache.get(queryParams) ?? [];

  const response = await fetch(`/api/lieux/chunk?${queryParams}`);

  if (!response.ok) {
    console.error(`Failed to fetch lieux for chunk [${latitude}, ${longitude}]`);
    return [];
  }

  const lieux = await response.json();

  lieuxCache.set(queryParams, lieux);

  return lieux;
};
