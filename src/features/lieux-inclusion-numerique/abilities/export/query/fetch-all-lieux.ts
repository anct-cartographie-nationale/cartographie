import {
  applyFilters,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteResponse
} from '@/libraries/inclusion-numerique-api';

export const fetchAllLieux = async (filters: FiltersSchema): Promise<LieuxRouteResponse> => {
  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    filter: applyFilters(filters),
    order: ['nom', 'asc']
  });
  return lieux;
};
