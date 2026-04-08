import { countFromHeaders, withCount } from '@/libraries/api/options';
import {
  buildCollectiviteFilter,
  type Collectivite,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteResponse
} from '@/libraries/inclusion-numerique-api';

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
    const [lieux, headers] = await inclusionNumeriqueFetchApi(
      LIEUX_ROUTE,
      {
        paginate: { limit, offset: (page - 1) * limit },
        select: LIEU_LIST_FIELDS,
        filter: buildCollectiviteFilter(filters, collectivite),
        order: ['nom', 'asc']
      },
      withCount()
    );
    return { lieux, total: countFromHeaders(headers) };
  };
