import { randomUUID } from 'node:crypto';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import { sharedAcrossBundles } from '@/libraries/nextjs/shared-across-bundles';
import { OpeningHoursCache } from './opening-hours-cache';

type Lieu = LieuxRouteResponse[number];

type LieuxStore = {
  all: LieuxRouteResponse;
  byId: Map<string, Lieu>;
  openingHours: OpeningHoursCache;
};

type LieuxCacheState = {
  instanceId: string;
  startedAt: string;
  currentData: Promise<LieuxRouteResponse> | null;
  currentStore: Promise<LieuxStore> | null;
  currentRefresh: Promise<void> | null;
  lastRefreshedAt: string | null;
  storeBuiltAt: string | null;
  lastTrigger: 'lazy' | 'refresh' | null;
  buildCount: number;
  size: number | null;
};

// One store per process, shared across Next's server bundle layers so that
// POST /api/cache/reset (route-handler layer) and the fiche (pages layer) read
// the same instance. Still per-replica — multi-replica is handled separately.
const state = sharedAcrossBundles(
  'lieux-cache',
  (): LieuxCacheState => ({
    instanceId: randomUUID(),
    startedAt: new Date().toISOString(),
    currentData: null,
    currentStore: null,
    currentRefresh: null,
    lastRefreshedAt: null,
    storeBuiltAt: null,
    lastTrigger: null,
    buildCount: 0,
    size: null
  })
);

const recordBuild = (data: LieuxRouteResponse, trigger: 'lazy' | 'refresh'): void => {
  const now = new Date().toISOString();
  state.storeBuiltAt ??= now;
  state.lastRefreshedAt = now;
  state.lastTrigger = trigger;
  state.buildCount += 1;
  state.size = data.length;
};

const collator = new Intl.Collator('fr', { sensitivity: 'base' });

const buildStore = (data: LieuxRouteResponse): LieuxStore => ({
  all: [...data].sort((a, b) => collator.compare(a.nom, b.nom)),
  byId: new Map(data.map((lieu) => [lieu.id, lieu])),
  openingHours: new OpeningHoursCache(data)
});

const getData = (): Promise<LieuxRouteResponse> => {
  if (!state.currentData) {
    state.currentData = inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true })
      .then(([data]) => data)
      .catch((error: unknown) => {
        state.currentData = null;
        throw error;
      });
  }
  return state.currentData;
};

const getStore = (): Promise<LieuxStore> => {
  if (!state.currentStore) {
    state.currentStore = getData()
      .then((data) => {
        const store = buildStore(data);
        recordBuild(data, 'lazy');
        return store;
      })
      .catch((error: unknown) => {
        state.currentStore = null;
        throw error;
      });
  }
  return state.currentStore;
};

export const invalidateCache = async (): Promise<void> => {
  if (!state.currentRefresh) {
    state.currentRefresh = inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true })
      .then(([data]) => data)
      .then((data) => {
        state.currentData = Promise.resolve(data);
        state.currentStore = Promise.resolve(buildStore(data));
        recordBuild(data, 'refresh');
      })
      .finally(() => {
        state.currentRefresh = null;
      });
  }
  return state.currentRefresh;
};

export const getAllLieux = async (): Promise<LieuxRouteResponse> => (await getStore()).all;

export const getSources = async (): Promise<string[]> =>
  [...new Set((await getAllLieux()).map((lieu) => lieu.source).filter(Boolean))].sort((a, b) => collator.compare(a, b));

export const getLieuById = async (id: string): Promise<Lieu | undefined> => (await getStore()).byId.get(id);

export const getOpeningHoursCache = async (): Promise<OpeningHoursCache> => (await getStore()).openingHours;

export type CacheStatus = {
  instanceId: string;
  pid: number;
  uptimeSec: number;
  startedAt: string;
  storeBuiltAt: string | null;
  lastRefreshedAt: string | null;
  lastTrigger: 'lazy' | 'refresh' | null;
  buildCount: number;
  size: number | null;
};

export const getCacheStatus = (): CacheStatus => ({
  instanceId: state.instanceId,
  pid: process.pid,
  uptimeSec: Math.round(process.uptime()),
  startedAt: state.startedAt,
  storeBuiltAt: state.storeBuiltAt,
  lastRefreshedAt: state.lastRefreshedAt,
  lastTrigger: state.lastTrigger,
  buildCount: state.buildCount,
  size: state.size
});
