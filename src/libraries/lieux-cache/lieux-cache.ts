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
  openingHours: OpeningHoursCache;
};

let currentStore: Promise<LieuxStore> | null = null;
let isRefreshing = false;

const collator = new Intl.Collator('fr', { sensitivity: 'base' });

const computeOpeningHours = (data: LieuxRouteResponse): OpeningHoursCache => {
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

  for (const lieu of data) {
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
  }

  return { parsed, openOnWeekend };
};

const buildStore = (data: LieuxRouteResponse): LieuxStore => ({
  all: [...data].sort((a, b) => collator.compare(a.nom, b.nom)),
  byId: new Map(data.map((lieu) => [lieu.id, lieu])),
  openingHours: computeOpeningHours(data)
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

export const getOpeningHoursCache = async (): Promise<OpeningHoursCache> => (await getStore()).openingHours;
