'use client';

import Supercluster from 'mutable-supercluster';
import { type MouseEvent, memo, Suspense, useEffect, useMemo, useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import type { ClusterFeature, ClusterProperties, PointFeature } from 'supercluster';
import { withoutAutourParams } from '@/libraries/inclusion-numerique-api/filters/autour';
import { provide } from '@/libraries/injection';
import { map$, type Position2D, spiderifyOffsets } from '@/libraries/map';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { Link, useSearchParams } from '@/libraries/nextjs/shim';
import { Subscribe, useSubscribe } from '@/libraries/reactivity/Subscribe';
import { ClusterMarker, LieuMarker } from '@/libraries/ui/map/markers';
import { useFilteredSearchParams } from '@/shared/hooks/use-filtered-search-params';
import { useLieuHighlight } from '@/shared/hooks/use-lieu-highlight';
import { LIEUX_CACHE, LIEUX_FOR_CHUNK } from '../../../injection';
import type { Lieu } from '../query/lieu';
import { lieuxCache } from '../query/lieux.cache';
import { lieuxWithHighlight$ } from '../query/lieux.stream';
import { fetchLieuxForChunk } from '../query/lieux-for-chunk.fetch';
import { setSearchParams } from '../query/search-params.stream';

const isCluster = (
  feature: PointFeature<Lieu> | ClusterFeature<ClusterProperties>
): feature is ClusterFeature<ClusterProperties> => 'cluster_id' in feature.properties;

const isLieu = (feature: PointFeature<Lieu> | ClusterFeature<ClusterProperties>): feature is PointFeature<Lieu> =>
  !isCluster(feature);

const toSpiderifyPoint = ({ properties }: PointFeature<Lieu>) => ({
  id: properties.id,
  position: [properties.longitude, properties.latitude] satisfies Position2D
});

const NO_OFFSET: Position2D = [0, 0];

const LieuMarkerLink = memo(
  ({ feature, offset, searchParams }: { feature: PointFeature<Lieu>; offset: Position2D; searchParams: URLSearchParams }) => {
    const [hovered, setHovered] = useState(false);
    const { isHighlighted, handlers } = useLieuHighlight(feature.properties.id);

    return (
      <Link
        href={hrefWithSearchParams(`/lieux/${feature.properties.id}`)(searchParams, ['page'])}
        prefetch={false}
        aria-label={feature.properties.nom}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        onMouseEnter={() => {
          setHovered(true);
          handlers.onMouseEnter();
        }}
        onMouseLeave={() => {
          setHovered(false);
          handlers.onMouseLeave();
        }}
      >
        {hovered && (
          <Popup {...feature.properties} anchor='bottom' offset={[offset[0], offset[1] - 20]} closeButton={false}>
            <h2 className='font-bold uppercase text-center'>{feature.properties.nom}</h2>
          </Popup>
        )}
        <LieuMarker title={feature.properties.nom} offset={offset} isHighlighted={isHighlighted} {...feature.properties} />
      </Link>
    );
  }
);

LieuMarkerLink.displayName = 'LieuMarkerLink';

export const LieuxOnMapContent = () => {
  useMemo(() => {
    provide(LIEUX_CACHE, lieuxCache);
    provide(LIEUX_FOR_CHUNK, fetchLieuxForChunk);
  }, []);

  const urlSearchParams = useSearchParams();
  const baseSearchParams: URLSearchParams = useMemo(() => withoutAutourParams(urlSearchParams), [urlSearchParams]);
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

  const lieux$Instance = useMemo(() => lieuxWithHighlight$(supercluster), [supercluster]);

  const handleSplitCluster =
    ({ geometry, properties }: ClusterFeature<ClusterProperties>) =>
    ({ nativeEvent }: MouseEvent) =>
      map?.flyTo(
        {
          center: [geometry.coordinates?.[0] ?? 0, geometry.coordinates?.[1] ?? 0],
          zoom: supercluster.getClusterExpansionZoom(properties.cluster_id),
          duration: 400
        },
        { originalEvent: nativeEvent }
      );

  return (
    <Subscribe to$={lieux$Instance}>
      {({ features, highlightedClusterId }) => {
        const offsets = spiderifyOffsets(features.filter(isLieu).map(toSpiderifyPoint));

        return features.map((feature) =>
          isCluster(feature) ? (
            <button
              key={feature.id}
              type='button'
              aria-label={`Zoomer sur ce groupe de ${feature.properties.point_count} lieux`}
              onClick={handleSplitCluster(feature)}
            >
              <ClusterMarker
                latitude={feature.geometry.coordinates?.[1] ?? 0}
                longitude={feature.geometry.coordinates?.[0] ?? 0}
                isHighlighted={feature.properties.cluster_id === highlightedClusterId}
              >
                {feature.properties.point_count}
              </ClusterMarker>
            </button>
          ) : (
            <LieuMarkerLink
              key={feature.properties.id}
              feature={feature}
              offset={offsets.get(feature.properties.id) ?? NO_OFFSET}
              searchParams={searchParams}
            />
          )
        );
      }}
    </Subscribe>
  );
};

export const LieuxOnMap = () => (
  <Suspense fallback={<div>Chargement...</div>}>
    <LieuxOnMapContent />
  </Suspense>
);
