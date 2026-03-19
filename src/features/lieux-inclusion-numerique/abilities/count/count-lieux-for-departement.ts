import { asCount, buildAndFilter, countFromHeaders, filterUnion } from '@/libraries/api/options';
import type { Departement } from '@/libraries/collectivites';
import {
  applyFilters,
  codeInseeStartWithFilterTemplate,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';

export const countLieuxForDepartement =
  (departement: Departement) =>
  async (filters: FiltersSchema): Promise<number> => {
    const filter = buildAndFilter(filterUnion([departement.code])(codeInseeStartWithFilterTemplate), applyFilters(filters));
    const [, headers] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }));
    return countFromHeaders(headers);
  };
