import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';

type Lieu = LieuxRouteResponse[number];

type LieuxStore = {
  all: LieuxRouteResponse;
  byId: Map<string, Lieu>;
};

const SIX_HOURS = 6 * 60 * 60 * 1000;

let cachePromise: Promise<LieuxStore> | null = null;
let cacheTimestamp = 0;

const buildStore = (data: LieuxRouteResponse): LieuxStore => ({
  all: [...data].sort((a, b) => a.nom.localeCompare(b.nom)),
  byId: new Map(data.map((lieu) => [lieu.id, lieu]))
});

const getStore = (): Promise<LieuxStore> => {
  if (cachePromise && Date.now() - cacheTimestamp <= SIX_HOURS) return cachePromise;

  cacheTimestamp = Date.now();
  cachePromise = inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true })
    .then(([data]) => buildStore(data))
    .catch((error: unknown) => {
      cachePromise = null;
      cacheTimestamp = 0;
      throw error;
    });

  return cachePromise;
};

export const getAllLieux = async (): Promise<LieuxRouteResponse> => (await getStore()).all;

export const getLieuById = async (id: string): Promise<Lieu | undefined> => (await getStore()).byId.get(id);
