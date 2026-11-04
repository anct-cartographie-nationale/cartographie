import { geographicDistance, type Localisation } from '@/libraries/inclusion-numerique-api/transfer/geographic-distance';

type MaybeLocated = { latitude?: number | undefined; longitude?: number | undefined };

const isLocated = <T extends MaybeLocated>(lieu: T): lieu is T & Localisation =>
  lieu.latitude != null && lieu.longitude != null;

export const nearestLieux =
  (centre: Localisation, limit: number) =>
  <T extends MaybeLocated>(lieux: T[]): T[] =>
    lieux
      .filter(isLocated)
      .map((lieu) => ({ lieu, distance: geographicDistance(lieu, centre) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map(({ lieu }) => lieu);
