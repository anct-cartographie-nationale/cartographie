import {
  buildCollectiviteFilter,
  type Collectivite,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteResponse
} from '@/libraries/inclusion-numerique-api';

export const fetchAllLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema): Promise<LieuxRouteResponse> => {
    const [lieux] = await inclusionNumeriqueFetchApi(
      LIEUX_ROUTE,
      {
        filter: buildCollectiviteFilter(filters, collectivite),
        order: ['nom', 'asc']
      },
      undefined,
      { noCache: true }
    );
    return lieux;
  };
