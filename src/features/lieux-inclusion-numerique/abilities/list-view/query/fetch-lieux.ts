import type { Collectivite, FiltersSchema, LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux } from '@/libraries/lieux-cache';

type PaginationParams = {
  page: number;
  limit: number;
};

export type LieuxWithTotal = {
  lieux: LieuxRouteResponse;
  total: number;
};

export const fetchLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema, { page, limit }: PaginationParams): Promise<LieuxWithTotal> => {
    const allLieux = await getAllLieux();
    const filtered = filterLieux(allLieux, filters, collectivite);
    return { lieux: filtered.slice((page - 1) * limit, page * limit), total: filtered.length };
  };
