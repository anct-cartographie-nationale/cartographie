import { buildAndFilter, filterUnion } from '@/libraries/api/options';
import type { Departement } from '@/libraries/collectivites';
import {
  applyFilters,
  codeInseeStartWithFilterTemplate,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteResponse
} from '@/libraries/inclusion-numerique-api';

export const fetchAllLieuxForDepartement =
  (departement: Departement) =>
  async (filters: FiltersSchema): Promise<LieuxRouteResponse> => {
    const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
      filter: buildAndFilter(filterUnion([departement.code])(codeInseeStartWithFilterTemplate), applyFilters(filters)),
      order: ['nom', 'asc']
    });
    return lieux;
  };
