import {
  buildCollectiviteFilter,
  type Collectivite,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE
} from '@/libraries/inclusion-numerique-api';

type PaginationParams = {
  page: number;
  limit: number;
};

export const fetchLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema, { page, limit }: PaginationParams) => {
    const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
      paginate: { limit, offset: (page - 1) * limit },
      select: LIEU_LIST_FIELDS,
      filter: buildCollectiviteFilter(filters, collectivite),
      order: ['nom', 'asc']
    });
    return lieux;
  };
