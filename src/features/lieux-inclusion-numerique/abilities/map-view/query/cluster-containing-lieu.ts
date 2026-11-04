import type { ClusterFeature, ClusterProperties, PointFeature } from 'supercluster';

type LeavesProvider = {
  getLeaves: (clusterId: number, limit?: number) => { properties: { id: string } }[];
};

const isCluster = <T extends object>(
  feature: PointFeature<T> | ClusterFeature<ClusterProperties>
): feature is ClusterFeature<ClusterProperties> => 'cluster_id' in feature.properties;

export const clusterContainingLieu = <T extends object>(
  leaves: LeavesProvider,
  features: (PointFeature<T> | ClusterFeature<ClusterProperties>)[],
  lieuId: string
): number | undefined =>
  features
    .filter(isCluster)
    .find(({ properties: { cluster_id } }) =>
      leaves.getLeaves(cluster_id, Number.POSITIVE_INFINITY).some(({ properties: { id } }) => id === lieuId)
    )?.properties.cluster_id;
