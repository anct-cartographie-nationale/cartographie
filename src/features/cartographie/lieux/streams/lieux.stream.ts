import { combineLatest, filter, from, merge, mergeMap, type Observable, of, scan, switchMap } from 'rxjs';
import { inject } from '@/libraries/injection';
import { boundingBoxCenter, MAP_CHUNK_OPTIONS, type Position2D, splitBondingBox } from '../../geo';
import type { Lieu } from '../domain/lieu';
import { LIEUX_CACHE } from '../lieux-cache.key';
import { LIEUX_FOR_CHUNK } from '../lieux-for-chunk.key';
import { boundingBox$ } from './bounding-box.stream';
import { zoom$ } from './zoom.stream';

type PositionsWithCache = { lieux: Lieu[]; positions: Position2D[] };

const toPositionsWithCache = ({ lieux, positions }: PositionsWithCache, position: Position2D) => {
  const cacheKey = `${position}`;
  const lieuxCache = inject(LIEUX_CACHE);

  return lieuxCache.has(cacheKey)
    ? { lieux: [...lieux, ...(lieuxCache.get(cacheKey) ?? [])], positions }
    : { lieux: lieux, positions: [...positions, position] };
};

const resolvePositions = ({ lieux, positions }: PositionsWithCache) =>
  positions.length === 0
    ? of(lieux)
    : merge(
        of(lieux),
        from(positions).pipe(
          mergeMap((position: Position2D): Observable<Lieu[]> => from(inject(LIEUX_FOR_CHUNK)(position))),
          scan((accumulated: Lieu[], newLieux: Lieu[]): Lieu[] => [...accumulated, ...newLieux], lieux)
        )
      );

export const lieux$: Observable<Lieu[]> = combineLatest([boundingBox$, zoom$]).pipe(
  filter(([_, zoom]) => zoom > 9),
  switchMap(([boundingBox, _]) => {
    const centers: Position2D[] = splitBondingBox(boundingBox, MAP_CHUNK_OPTIONS).map(boundingBoxCenter);

    return centers.length === 0
      ? of([])
      : resolvePositions(centers.reduce<PositionsWithCache>(toPositionsWithCache, { lieux: [], positions: [] }));
  })
);
