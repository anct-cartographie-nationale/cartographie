import { randomUUID } from 'node:crypto';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import { OpeningHoursCache } from './opening-hours-cache';

type Lieu = LieuxRouteResponse[number];

type LieuxStore = {
  all: LieuxRouteResponse;
  byId: Map<string, Lieu>;
  openingHours: OpeningHoursCache;
};

// Identity of THIS module instance. If the same process reports more than one
// instanceId (same pid), the module is duplicated across server bundles; if the
// pid also differs, requests are hitting distinct replicas. Either way it tells
// us which store a given request was served from.
const instanceId = randomUUID();
const startedAt = new Date().toISOString();

let currentData: Promise<LieuxRouteResponse> | null = null;
let currentStore: Promise<LieuxStore> | null = null;
let currentRefresh: Promise<void> | null = null;
let lastRefreshedAt: string | null = null;
let storeBuiltAt: string | null = null;
let lastTrigger: 'lazy' | 'refresh' | null = null;
let buildCount = 0;
let size: number | null = null;

const recordBuild = (data: LieuxRouteResponse, trigger: 'lazy' | 'refresh'): void => {
  const now = new Date().toISOString();
  storeBuiltAt ??= now;
  lastRefreshedAt = now;
  lastTrigger = trigger;
  buildCount += 1;
  size = data.length;
};

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
        recordBuild(data, 'lazy');
        return store;
      })
      .catch((error: unknown) => {
        currentStore = null;
        throw error;
      });
  }
  return currentStore;
};

export const invalidateCache = async (): Promise<void> => {
  currentRefresh ??= inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true })
    .then(([data]) => data)
    .then((data) => {
      currentData = Promise.resolve(data);
      currentStore = Promise.resolve(buildStore(data));
      recordBuild(data, 'refresh');
    })
    .finally(() => {
      currentRefresh = null;
    });
  return currentRefresh;
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
  instanceId,
  pid: process.pid,
  uptimeSec: Math.round(process.uptime()),
  startedAt,
  storeBuiltAt,
  lastRefreshedAt,
  lastTrigger,
  buildCount,
  size
});
