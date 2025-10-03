import { inject } from '@/libraries/injection';
import type { Position2D } from '../../geo';
import type { Lieu } from '../domain/lieu';
import type { LieuxForChunk } from '../domain/lieux-for-chunk';
import { LIEUX_CACHE } from '../lieux-cache.key';

export const fetchLieuxForChunk: LieuxForChunk = async (position: Position2D): Promise<Lieu[]> => {
  const cacheKey = `${position}`;
  const [longitude, latitude] = position;

  const lieuxCache = inject(LIEUX_CACHE);

  if (lieuxCache.has(cacheKey)) return lieuxCache.get(cacheKey) ?? [];

  const response = await fetch(`/api/lieux-chunk?latitude=${latitude}&longitude=${longitude}`);

  if (!response.ok) {
    console.error(`Failed to fetch lieux for chunk [${latitude}, ${longitude}]`);
    return [];
  }

  const lieux = await response.json();

  lieuxCache.set(cacheKey, lieux);

  return lieux;
};
