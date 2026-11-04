import Supercluster from 'mutable-supercluster';
import type { ClusterProperties, PointFeature } from 'supercluster';
import { describe, expect, it } from 'vitest';
import { clusterContainingLieu } from './cluster-containing-lieu';

type Lieu = { id: string };

const point = (id: string, longitude: number, latitude: number): PointFeature<Lieu> => ({
  type: 'Feature',
  properties: { id },
  geometry: { type: 'Point', coordinates: [longitude, latitude] }
});

const WORLD: [number, number, number, number] = [-180, -85, 180, 85];
const ZOOM = 10;

const clustered = () => {
  const supercluster = new Supercluster<Lieu, ClusterProperties>({ radius: 50, maxZoom: 16, getId: ({ id }: Lieu) => id });
  supercluster.load([point('a', -4.2576, 48.4508), point('b', -4.2576, 48.4508), point('seul', 2.3522, 48.8566)]);
  return { supercluster, features: supercluster.getClusters(WORLD, ZOOM) };
};

describe('clusterContainingLieu', () => {
  it('finds the cluster containing the lieu', () => {
    const { supercluster, features } = clustered();

    const clusterId = clusterContainingLieu(supercluster, features, 'a');

    expect(clusterId).toBeDefined();
    expect(clusterContainingLieu(supercluster, features, 'b')).toBe(clusterId);
  });

  it('finds nothing for a lieu displayed on its own', () => {
    const { supercluster, features } = clustered();

    expect(clusterContainingLieu(supercluster, features, 'seul')).toBeUndefined();
  });

  it('finds nothing for a lieu out of the displayed features', () => {
    const { supercluster, features } = clustered();

    expect(clusterContainingLieu(supercluster, features, 'inconnu')).toBeUndefined();
  });
});
