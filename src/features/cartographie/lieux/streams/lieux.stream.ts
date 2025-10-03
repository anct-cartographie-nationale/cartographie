import type Supercluster from 'mutable-supercluster';
import { combineLatest, filter, from, map, merge, mergeMap, type Observable, of, scan, switchMap } from 'rxjs';
import type { ClusterFeature, ClusterProperties, PointFeature } from 'supercluster';
import { inject } from '@/libraries/injection';
import { boundingBoxCenter, MAP_CHUNK_OPTIONS, type Position2D, splitBondingBox } from '../../geo';
import type { Lieu } from '../domain/lieu';
import { LIEUX_CACHE } from '../lieux-cache.key';
import { LIEUX_FOR_CHUNK } from '../lieux-for-chunk.key';
import { boundingBox$ } from './bounding-box.stream';
import { zoom$ } from './zoom.stream';

type PositionsWithCache = { lieux: Lieu[]; positions: Position2D[] };

const EMPTY_POSITIONS_WITH_CACHE: PositionsWithCache = { lieux: [], positions: [] };

const resolvePositions = ({ lieux, positions }: PositionsWithCache): Observable<Lieu[]> =>
  positions.length === 0
    ? of(lieux)
    : merge(
        of(lieux),
        from(positions).pipe(
          mergeMap((position: Position2D): Observable<Lieu[]> => from(inject(LIEUX_FOR_CHUNK)(position))),
          scan((accumulated: Lieu[], newLieux: Lieu[]): Lieu[] => [...accumulated, ...newLieux], lieux)
        )
      );

const toPositionsWithCache = ({ lieux, positions }: PositionsWithCache, position: Position2D) => {
  const cacheKey = `${position}`;
  const lieuxCache = inject(LIEUX_CACHE);

  return lieuxCache.has(cacheKey)
    ? { lieux: [...lieux, ...(lieuxCache.get(cacheKey) ?? [])], positions }
    : { lieux: lieux, positions: [...positions, position] };
};

const toPointFeature = <T extends { latitude: number; longitude: number }>(properties: T): PointFeature<T> => ({
  type: 'Feature',
  properties: properties,
  geometry: {
    type: 'Point',
    coordinates: [properties.longitude, properties.latitude]
  }
});

export const lieux$ = (
  supercluster: Supercluster<Lieu, ClusterProperties>
): Observable<(ClusterFeature<ClusterProperties> | PointFeature<Lieu>)[]> =>
  combineLatest([zoom$, boundingBox$]).pipe(
    filter(([zoom]) => zoom > 9),
    switchMap(([zoom, boundingBox]) => {
      const centers: Position2D[] = splitBondingBox(boundingBox, MAP_CHUNK_OPTIONS).map(boundingBoxCenter);

      return centers.length === 0
        ? of([])
        : resolvePositions(centers.reduce<PositionsWithCache>(toPositionsWithCache, EMPTY_POSITIONS_WITH_CACHE)).pipe(
            map((lieux: Lieu[]) => supercluster.load(lieux.map(toPointFeature)).getClusters(boundingBox, zoom))
          );
    })
  );
