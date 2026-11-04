import { Page, PageSize, type Paginated, paginate } from '@arckit/resultset';
import {
  type Collectivite,
  type FiltersSchema,
  LIEU_LIST_FIELDS,
  type LieuxRouteResponse
} from '@/libraries/inclusion-numerique-api';
import type { Localisation } from '@/libraries/inclusion-numerique-api/transfer/geographic-distance';
import { filterLieux, getAllLieux, getOpeningHoursCache, nearestLieux } from '@/libraries/lieux-cache';

type PaginationParams = {
  page: number;
  limit: number;
};

const LIEUX_AUTOUR_LIMIT = 200;

const pick = (lieu: LieuxRouteResponse[number]): LieuxRouteResponse[number] =>
  Object.fromEntries(LIEU_LIST_FIELDS.map((key) => [key, lieu[key]])) as LieuxRouteResponse[number];

const toPaginatedListItems = (
  lieux: LieuxRouteResponse,
  { page, limit }: PaginationParams
): Paginated<LieuxRouteResponse[number]> => {
  const paginated = paginate(lieux, { page: Page(page), pageSize: PageSize(limit) });
  return { ...paginated, items: paginated.items.map(pick) };
};

export const fetchLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema, pagination: PaginationParams): Promise<Paginated<LieuxRouteResponse[number]>> => {
    const [allLieux, ohCache] = await Promise.all([getAllLieux(), getOpeningHoursCache()]);
    return toPaginatedListItems(filterLieux(allLieux, filters, collectivite, ohCache), pagination);
  };

export const fetchLieuxAutour =
  (centre: Localisation) =>
  async (filters: FiltersSchema, pagination: PaginationParams): Promise<Paginated<LieuxRouteResponse[number]>> => {
    const [allLieux, ohCache] = await Promise.all([getAllLieux(), getOpeningHoursCache()]);
    return toPaginatedListItems(
      nearestLieux(centre, LIEUX_AUTOUR_LIMIT)(filterLieux(allLieux, filters, undefined, ohCache)),
      pagination
    );
  };
