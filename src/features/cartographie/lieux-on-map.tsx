import Supercluster from 'mutable-supercluster';
import { Suspense, useMemo, useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import type { ClusterFeature, ClusterProperties, PointFeature } from 'supercluster';
import { useFilteredSearchParams } from '@/libraries/hooks/use-filtered-search-params';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams } from '@/libraries/next';
import { Link, useSearchParams } from '@/libraries/next-shim';
import { Subscribe, useSubscribe } from '@/libraries/reactivity/Subscribe';
import type { Lieu } from './lieux/domain/lieu';
import { lieuxCache } from './lieux/impementations/lieux.cache';
import { fetchLieuxForChunk } from './lieux/impementations/lieux-for-chunk.fetch';
import { LIEUX_CACHE } from './lieux/lieux-cache.key';
import { LIEUX_FOR_CHUNK } from './lieux/lieux-for-chunk.key';
import { lieux$ } from './lieux/streams/lieux.stream';
import { map$ } from './map/streams/map.stream';
import { ClusterMarker } from './markers/cluster.marker';
import { LieuMarker } from './markers/lieu.marker';

const isCluster = (
  feature: PointFeature<Lieu> | ClusterFeature<ClusterProperties>
): feature is ClusterFeature<ClusterProperties> => 'cluster_id' in feature.properties;

export const LieuxOnMapContent = () => {
  provide(LIEUX_CACHE, lieuxCache);
  provide(LIEUX_FOR_CHUNK, fetchLieuxForChunk);

  const urlSearchParams = useSearchParams();
  const baseSearchParams: URLSearchParams = useMemo(() => new URLSearchParams(urlSearchParams), [urlSearchParams]);
  const searchParams = useFilteredSearchParams(baseSearchParams);

  const [hoveredId, setHoveredId] = useState<string>();

  const [map] = useSubscribe(map$);

  const supercluster = useMemo(
    () =>
      new Supercluster<Lieu, ClusterProperties>({
        radius: 50,
        maxZoom: 16,
        getId: (lieu: Lieu) => lieu.id
      }),
    []
  );

  const lieux$Instance = useMemo(() => lieux$(supercluster, searchParams), [supercluster, searchParams]);

  const handleSplitCluster =
    ({ geometry, properties }: ClusterFeature<ClusterProperties>) =>
    () =>
      map?.flyTo({
        center: [geometry.coordinates?.[0] ?? 0, geometry.coordinates?.[1] ?? 0],
        zoom: supercluster.getClusterExpansionZoom(properties.cluster_id),
        duration: 400
      });

  return (
    <Subscribe to$={lieux$Instance}>
      {({ features }) =>
        features.map((feature) =>
          isCluster(feature) ? (
            <button key={feature.id} type='button' onClick={handleSplitCluster(feature)}>
              <ClusterMarker
                latitude={feature.geometry.coordinates?.[1] ?? 0}
                longitude={feature.geometry.coordinates?.[0] ?? 0}
              >
                {feature.properties.point_count}
              </ClusterMarker>
            </button>
          ) : (
            <Link
              href={hrefWithSearchParams(`/lieux/${feature.properties.id}`)(searchParams, ['page'])}
              key={feature.properties.id}
              onMouseEnter={() => setHoveredId(feature.properties.id)}
              onMouseLeave={() => setHoveredId(undefined)}
            >
              {hoveredId === feature.properties.id && (
                <Popup {...feature.properties} anchor='bottom' offset={[0, -20]} closeButton={false}>
                  <h2 className='font-bold uppercase text-center'>{feature.properties.nom}</h2>
                </Popup>
              )}
              <LieuMarker title={feature.properties.nom} {...feature.properties} />
            </Link>
          )
        )
      }
    </Subscribe>
  );
};

export const LieuxOnMap = () => (
  <Suspense fallback={<div>Chargement...</div>}>
    <LieuxOnMapContent />
  </Suspense>
);
