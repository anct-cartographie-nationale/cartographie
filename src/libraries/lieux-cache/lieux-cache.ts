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
let isRefreshing = false;

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
    currentStore = getData().then(buildStore);
  }
  return currentStore;
};

export const invalidateCache = (onError: (error: unknown) => void = () => {}): void => {
  if (isRefreshing) return;
  isRefreshing = true;
  const freshData = inclusionNumeriqueFetchApi(LIEUX_ROUTE, {}, undefined, { noCache: true }).then(([data]) => data);
  freshData
    .then((data) => {
      currentData = Promise.resolve(data);
      currentStore = Promise.resolve(buildStore(data));
    })
    .catch(onError)
    .finally(() => {
      isRefreshing = false;
    });
};

export const getAllLieux = async (): Promise<LieuxRouteResponse> => (await getStore()).all;

export const getLieuById = async (id: string): Promise<Lieu | undefined> => (await getStore()).byId.get(id);

export const getOpeningHoursCache = async (): Promise<OpeningHoursCache> => (await getStore()).openingHours;
