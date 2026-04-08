import { inject } from '@/libraries/injection';
import type { Position2D } from '@/libraries/map';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { API_BASE_URL } from '@/shared/injection';
import { LIEUX_CACHE, type LieuxForChunk } from '../../../injection';
import type { Lieu } from './lieu';
import { ensureCacheLimit } from './lieux.cache';

const cacheKeyAt = (searchParams: URLSearchParams): string => searchParams.toString();

const searchParamsWithLocation =
  (position: Position2D) =>
  (urlSearchParams: URLSearchParams): URLSearchParams => {
    const [longitude, latitude] = position;

    const searchParams = new URLSearchParams(urlSearchParams);

    searchParams.set('latitude', latitude.toString());
    searchParams.set('longitude', longitude.toString());

    return searchParams;
  };

export const fetchLieuxForChunk: LieuxForChunk = async (
  position: Position2D,
  urlSearchParams: URLSearchParams
): Promise<Lieu[]> => {
  const [longitude, latitude] = position;

  const searchParams: URLSearchParams = searchParamsWithLocation(position)(urlSearchParams);
  const cacheKey: string = cacheKeyAt(searchParams);

  const lieuxCache: Map<string, Lieu[]> = inject(LIEUX_CACHE);

  if (lieuxCache.has(cacheKey)) return lieuxCache.get(cacheKey) ?? [];

  const response: Response = await fetch(hrefWithSearchParams(`${inject(API_BASE_URL)}/lieux/chunk`)(searchParams, ['page']));

  if (!response.ok) {
    console.error(`Failed to fetch lieux for chunk [${latitude}, ${longitude}]`);
    return [];
  }

  const lieux = await response.json();

  ensureCacheLimit(lieuxCache);
  lieuxCache.set(cacheKey, lieux);

  return lieux;
};
