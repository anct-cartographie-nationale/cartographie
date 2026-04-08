'use client';

import Supercluster from 'mutable-supercluster';
import { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import type { ClusterFeature, ClusterProperties, PointFeature } from 'supercluster';
import { provide } from '@/libraries/injection';
import { map$ } from '@/libraries/map';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { Link, useSearchParams } from '@/libraries/nextjs/shim';
import { Subscribe, useSubscribe } from '@/libraries/reactivity/Subscribe';
import { ClusterMarker, LieuMarker } from '@/libraries/ui/map/markers';
import { useFilteredSearchParams } from '@/shared/hooks/use-filtered-search-params';
import { LIEUX_CACHE, LIEUX_FOR_CHUNK } from '../../../injection';
import type { Lieu } from '../query/lieu';
import { lieuxCache } from '../query/lieux.cache';
import { lieux$ } from '../query/lieux.stream';
import { fetchLieuxForChunk } from '../query/lieux-for-chunk.fetch';
import { setSearchParams } from '../query/search-params.stream';

const isCluster = (
  feature: PointFeature<Lieu> | ClusterFeature<ClusterProperties>
): feature is ClusterFeature<ClusterProperties> => 'cluster_id' in feature.properties;

const LieuMarkerLink = memo(({ feature, searchParams }: { feature: PointFeature<Lieu>; searchParams: URLSearchParams }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={hrefWithSearchParams(`/lieux/${feature.properties.id}`)(searchParams, ['page'])}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <Popup {...feature.properties} anchor='bottom' offset={[0, -20]} closeButton={false}>
          <h2 className='font-bold uppercase text-center'>{feature.properties.nom}</h2>
        </Popup>
      )}
      <LieuMarker title={feature.properties.nom} {...feature.properties} />
    </Link>
  );
});

LieuMarkerLink.displayName = 'LieuMarkerLink';

export const LieuxOnMapContent = () => {
  useMemo(() => {
    provide(LIEUX_CACHE, lieuxCache);
    provide(LIEUX_FOR_CHUNK, fetchLieuxForChunk);
  }, []);

  const urlSearchParams = useSearchParams();
  const baseSearchParams: URLSearchParams = useMemo(() => new URLSearchParams(urlSearchParams), [urlSearchParams]);
  const searchParams = useFilteredSearchParams(baseSearchParams);

  useEffect(() => {
    setSearchParams(searchParams);
  }, [searchParams]);

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

  const lieux$Instance = useMemo(() => lieux$(supercluster), [supercluster]);

  const handleSplitCluster = useCallback(
    ({ geometry, properties }: ClusterFeature<ClusterProperties>) =>
      () =>
        map?.flyTo({
          center: [geometry.coordinates?.[0] ?? 0, geometry.coordinates?.[1] ?? 0],
          zoom: supercluster.getClusterExpansionZoom(properties.cluster_id),
          duration: 400
        }),
    [map, supercluster]
  );

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
            <LieuMarkerLink key={feature.properties.id} feature={feature} searchParams={searchParams} />
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
