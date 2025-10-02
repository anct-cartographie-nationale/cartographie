import { combineLatest, filter, from, merge, mergeMap, type Observable, of, scan, switchMap } from 'rxjs';
import { boundingBoxCenter, type Position2D, splitBondingBox } from '../map-chunk';
import { MAP_CHUNK_OPTIONS } from '../map-chunk-options';
import { boundingBox$ } from './bounding-box.stream';
import { zoom$ } from './zoom.stream';

type Lieu = { id: string; latitude: number; longitude: number };

const lieuxCache = new Map<string, Lieu[]>();

const getCacheKey = ([longitude, latitude]: Position2D): string => `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

const fetchLieuxForChunk = async ([longitude, latitude]: Position2D): Promise<Lieu[]> => {
  const cacheKey = getCacheKey([longitude, latitude]);

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

export const lieux$: Observable<Lieu[]> = combineLatest([boundingBox$, zoom$]).pipe(
  filter(([_, zoom]) => zoom > 9),
  switchMap(([boundingBox, _]) => {
    const positions: Position2D[] = splitBondingBox(boundingBox, MAP_CHUNK_OPTIONS).map(boundingBoxCenter);

    if (positions.length === 0) return of([]);

    const cachedResults: Lieu[] = [];
    const uncachedPositions: Position2D[] = [];

    positions.map((position) => {
      const cacheKey = getCacheKey(position);
      return lieuxCache.has(cacheKey)
        ? cachedResults.push(...(lieuxCache.get(cacheKey) ?? []))
        : uncachedPositions.push(position);
    });

    return uncachedPositions.length === 0
      ? of(cachedResults)
      : merge(
          of(cachedResults),
          from(uncachedPositions).pipe(
            mergeMap((position: Position2D) => from(fetchLieuxForChunk(position))),
            scan((accumulated: Lieu[], newLieux: Lieu[]) => [...accumulated, ...newLieux], cachedResults)
          )
        );
  })
);
