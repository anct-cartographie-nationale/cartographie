import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';

type Lieu = LieuxRouteResponse[number];

type LieuxStore = {
  all: LieuxRouteResponse;
  byId: Map<string, Lieu>;
};

let currentStore: Promise<LieuxStore> | null = null;
let isRefreshing = false;

const collator = new Intl.Collator('fr', { sensitivity: 'base' });

const buildStore = (data: LieuxRouteResponse): LieuxStore => ({
  all: [...data].sort((a, b) => collator.compare(a.nom, b.nom)),
  byId: new Map(data.map((lieu) => [lieu.id, lieu]))
});

const fetchStore = (): Promise<LieuxStore> =>
  inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true }).then(([data]) => buildStore(data));

const getStore = (): Promise<LieuxStore> => {
  if (!currentStore) {
    currentStore = fetchStore().catch((error: unknown) => {
      currentStore = null;
      throw error;
    });
  }
  return currentStore;
};

export const invalidateCache = (): void => {
  if (isRefreshing) return;
  isRefreshing = true;
  fetchStore()
    .then((store) => {
      currentStore = Promise.resolve(store);
    })
    .catch(() => {})
    .finally(() => {
      isRefreshing = false;
    });
};

export const getAllLieux = async (): Promise<LieuxRouteResponse> => (await getStore()).all;

export const getLieuById = async (id: string): Promise<Lieu | undefined> => (await getStore()).byId.get(id);
