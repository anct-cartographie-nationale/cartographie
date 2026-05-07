import OpeningHours from 'opening_hours';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';

type Lieu = LieuxRouteResponse[number];

export type OpeningHoursCache = {
  parsed: Map<string, OpeningHours>;
  openOnWeekend: Set<string>;
};

type LieuxStore = {
  all: LieuxRouteResponse;
  byId: Map<string, Lieu>;
};

let currentData: Promise<LieuxRouteResponse> | null = null;
let currentStore: Promise<LieuxStore> | null = null;
let currentOHCache: Promise<OpeningHoursCache> | null = null;
let isRefreshing = false;

const collator = new Intl.Collator('fr', { sensitivity: 'base' });

const yieldToEventLoop = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

const BATCH_SIZE = 100;

const computeOpeningHours = async (data: LieuxRouteResponse): Promise<OpeningHoursCache> => {
  await yieldToEventLoop();

  const parsed = new Map<string, OpeningHours>();
  const openOnWeekend = new Set<string>();

  const now = new Date();

  const saturdayStart = new Date(now);
  saturdayStart.setDate(saturdayStart.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  saturdayStart.setHours(0, 0, 0, 0);
  const saturdayEnd = new Date(saturdayStart);
  saturdayEnd.setHours(23, 59, 59, 999);

  const sundayStart = new Date(now);
  sundayStart.setDate(sundayStart.getDate() + ((7 - now.getDay()) % 7 || 7));
  sundayStart.setHours(0, 0, 0, 0);
  const sundayEnd = new Date(sundayStart);
  sundayEnd.setHours(23, 59, 59, 999);

  for (let i = 0; i < data.length; i++) {
    const lieu = data[i]!;
    if (!lieu.horaires) continue;
    try {
      const oh = new OpeningHours(lieu.horaires);
      parsed.set(lieu.id, oh);
      if (
        oh.getOpenIntervals(saturdayStart, saturdayEnd).length > 0 ||
        oh.getOpenIntervals(sundayStart, sundayEnd).length > 0
      ) {
        openOnWeekend.add(lieu.id);
      }
    } catch {
      // Invalid horaires format
    }
    if (i % BATCH_SIZE === 0 && i > 0) await yieldToEventLoop();
  }

  return { parsed, openOnWeekend };
};

const buildStore = (data: LieuxRouteResponse): LieuxStore => ({
  all: [...data].sort((a, b) => collator.compare(a.nom, b.nom)),
  byId: new Map(data.map((lieu) => [lieu.id, lieu]))
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
    currentStore = getData().then(buildStore);
  }
  return currentStore;
};

const getOHCache = (): Promise<OpeningHoursCache> => {
  if (!currentOHCache) {
    currentOHCache = getData()
      .then(computeOpeningHours)
      .catch((error: unknown) => {
        currentOHCache = null;
        throw error;
      });
  }
  return currentOHCache;
};

export const invalidateCache = (): void => {
  if (isRefreshing) return;
  isRefreshing = true;
  const freshData = inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true }).then(([data]) => data);
  freshData
    .then((data) => {
      currentData = Promise.resolve(data);
      currentStore = Promise.resolve(buildStore(data));
      currentOHCache = null;
    })
    .catch(() => {})
    .finally(() => {
      isRefreshing = false;
    });
};

export const getAllLieux = async (): Promise<LieuxRouteResponse> => (await getStore()).all;

export const getLieuById = async (id: string): Promise<Lieu | undefined> => (await getStore()).byId.get(id);

export const getOpeningHoursCache = async (): Promise<OpeningHoursCache> => getOHCache();
