declare module 'mutable-supercluster' {
  import type { BBox, Feature, Point } from 'geojson';
  interface ClusterProperties {
    cluster: boolean;
    cluster_id: number;
    point_count: number;
  }
  export default class MutableSupercluster<P, C = ClusterProperties> {
    constructor(options: {
      radius?: number;
      maxZoom?: number;
      getId?: (props: P) => number | string;
    });
    load(points: Feature<Point, P>[]): this;
    getClusters(bbox: BBox, zoom: number): (Feature<Point, P> | Feature<Point, C>)[];
    getClusterExpansionZoom: (clusterId: number) => number;
  }
}
