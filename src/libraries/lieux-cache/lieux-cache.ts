import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import { OpeningHoursCache } from './opening-hours-cache';

type Lieu = LieuxRouteResponse[number];

type LieuxStore = {
  all: LieuxRouteResponse;
  byId: Map<string, Lieu>;
  openingHours: OpeningHoursCache;
};

let currentData: Promise<LieuxRouteResponse> | null = null;
let currentStore: Promise<LieuxStore> | null = null;
let currentRefresh: Promise<void> | null = null;
let lastRefreshedAt: string | null = null;

const collator = new Intl.Collator('fr', { sensitivity: 'base' });

const buildStore = (data: LieuxRouteResponse): LieuxStore => ({
  all: [...data].sort((a, b) => collator.compare(a.nom, b.nom)),
  byId: new Map(data.map((lieu) => [lieu.id, lieu])),
  openingHours: new OpeningHoursCache(data)
});

const getData = (): Promise<LieuxRouteResponse> => {
  if (!currentData) {
    currentData = inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true })
      .then(([data]) => data)
      .catch((error: unknown) => {
        currentData = null;
        throw error;
      });
  }
  return currentData;
};

const getStore = (): Promise<LieuxStore> => {
  if (!currentStore) {
    currentStore = getData()
      .then((data) => {
        const store = buildStore(data);
        lastRefreshedAt = new Date().toISOString();
        return store;
      })
      .catch((error: unknown) => {
        currentStore = null;
        throw error;
      });
  }
  return currentStore;
};

// Recharge le dataset depuis ANCT et remplace le cache mémoire. Renvoie la promesse du
// refresh (rejetée en cas d'échec) ; les appels concurrents partagent le même refresh en cours.
// L'appelant doit attendre cette promesse AVANT d'invalider les caches en aval (Next/nginx),
// sinon ils se réamorcent avec des données encore périmées.
export const invalidateCache = (): Promise<void> => {
  currentRefresh ??= inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true })
    .then(([data]) => data)
    .then((data) => {
      currentData = Promise.resolve(data);
      currentStore = Promise.resolve(buildStore(data));
      lastRefreshedAt = new Date().toISOString();
    })
    .finally(() => {
      currentRefresh = null;
    });
  return currentRefresh;
};

export const getAllLieux = async (): Promise<LieuxRouteResponse> => (await getStore()).all;

export const getLieuById = async (id: string): Promise<Lieu | undefined> => (await getStore()).byId.get(id);

export const getOpeningHoursCache = async (): Promise<OpeningHoursCache> => (await getStore()).openingHours;

export const getCacheStatus = (): { lastRefreshedAt: string | null } => ({ lastRefreshedAt });
