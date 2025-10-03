import Supercluster from 'mutable-supercluster';
import { useMap } from 'react-map-gl/maplibre';
import type { ClusterFeature, ClusterProperties, PointFeature } from 'supercluster';
import { provide } from '@/libraries/injection';
import { Subscribe } from '@/libraries/reactivity/Subscribe';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from './cartographie-ids';
import type { Lieu } from './lieux/domain/lieu';
import { lieuxCache } from './lieux/impementations/lieux.cache';
import { fetchLieuxForChunk } from './lieux/impementations/lieux-for-chunk.fetch';
import { LIEUX_CACHE } from './lieux/lieux-cache.key';
import { LIEUX_FOR_CHUNK } from './lieux/lieux-for-chunk.key';
import { lieux$ } from './lieux/streams/lieux.stream';
import { ClusterMarker } from './markers/cluster.marker';
import { LieuMarker } from './markers/lieu.marker';

const isCluster = (
  feature: PointFeature<Lieu> | ClusterFeature<ClusterProperties>
): feature is ClusterFeature<ClusterProperties> => 'cluster_id' in feature.properties;

export const LieuxOnMap = () => {
  provide(LIEUX_CACHE, lieuxCache);
  provide(LIEUX_FOR_CHUNK, fetchLieuxForChunk);

  const map = useMap()[CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID];

  const supercluster = new Supercluster<Lieu, ClusterProperties>({
    radius: 50,
    maxZoom: 16,
    getId: (lieu: Lieu) => lieu.id
  });

  const handleSplitCluster =
    ({ geometry, properties }: ClusterFeature<ClusterProperties>) =>
    () =>
      map?.flyTo({
        center: [geometry.coordinates?.[0] ?? 0, geometry.coordinates?.[1] ?? 0],
        zoom: supercluster.getClusterExpansionZoom(properties.cluster_id),
        duration: 400
      });

  return (
    <Subscribe to$={lieux$(supercluster)}>
      {(features) =>
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
            <LieuMarker key={feature.properties.id} {...feature.properties} />
          )
        )
      }
    </Subscribe>
  );
};
