import { Page, PageSize, type Paginated, paginate } from '@arckit/resultset';
import {
  type Collectivite,
  type FiltersSchema,
  LIEU_LIST_FIELDS,
  type LieuxRouteResponse
} from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux, getOpeningHoursCache } from '@/libraries/lieux-cache';

type PaginationParams = {
  page: number;
  limit: number;
};

const pick = (lieu: LieuxRouteResponse[number]): LieuxRouteResponse[number] =>
  Object.fromEntries(LIEU_LIST_FIELDS.map((key) => [key, lieu[key]])) as LieuxRouteResponse[number];

export const fetchLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema, { page, limit }: PaginationParams): Promise<Paginated<LieuxRouteResponse[number]>> => {
    const [allLieux, ohCache] = await Promise.all([getAllLieux(), getOpeningHoursCache()]);
    const filtered = filterLieux(allLieux, filters, collectivite, ohCache);
    const paginated = paginate(filtered, { page: Page(page), pageSize: PageSize(limit) });
    return { ...paginated, items: paginated.items.map(pick) };
  };
