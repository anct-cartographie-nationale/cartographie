import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';

type Lieu = LieuxRouteResponse[number];

type LieuxStore = {
  all: LieuxRouteResponse;
  byId: Map<string, Lieu>;
};

const SIX_HOURS = 6 * 60 * 60 * 1000;

let currentStore: Promise<LieuxStore> | null = null;
let cacheTimestamp = 0;
let isRefreshing = false;

const collator = new Intl.Collator('fr', { sensitivity: 'base' });

const buildStore = (data: LieuxRouteResponse): LieuxStore => ({
  all: [...data].sort((a, b) => collator.compare(a.nom, b.nom)),
  byId: new Map(data.map((lieu) => [lieu.id, lieu]))
});

const fetchStore = (): Promise<LieuxStore> =>
  inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true }).then(([data]) => buildStore(data));

const refreshInBackground = (): void => {
  if (isRefreshing) return;
  isRefreshing = true;
  fetchStore()
    .then((store) => {
      currentStore = Promise.resolve(store);
      cacheTimestamp = Date.now();
    })
    .catch(() => {})
    .finally(() => {
      isRefreshing = false;
    });
};

const getStore = (): Promise<LieuxStore> => {
  if (currentStore && Date.now() - cacheTimestamp > SIX_HOURS) {
    refreshInBackground();
  }

  if (!currentStore) {
    cacheTimestamp = Date.now();
    currentStore = fetchStore().catch((error: unknown) => {
      currentStore = null;
      cacheTimestamp = 0;
      throw error;
    });
  }

  return currentStore;
};

export const getAllLieux = async (): Promise<LieuxRouteResponse> => (await getStore()).all;

export const getLieuById = async (id: string): Promise<Lieu | undefined> => (await getStore()).byId.get(id);
