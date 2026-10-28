import type { LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';

type Lieu = LieuxRouteResponse[number];

export const indexLieuxById = (lieux: LieuxRouteResponse): Map<string, Lieu> => {
  const index = new Map<string, Lieu>(lieux.map((lieu: Lieu): [string, Lieu] => [lieu.id, lieu]));

  lieux.forEach((lieu: Lieu): void => {
    const herite = lieu.id_cartographie_nationale;
    if (herite != null && herite !== '' && !index.has(herite)) index.set(herite, lieu);
  });

  return index;
};
