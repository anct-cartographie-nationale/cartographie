import { asCount, buildAndFilter, countFromHeaders, filterUnion } from '@/libraries/api/options';
import type { Region } from '@/libraries/collectivites';
import {
  applyFilters,
  codeInseeStartWithFilterTemplate,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';

export const countLieuxForRegion =
  (region: Region) =>
  async (filters: FiltersSchema): Promise<number> => {
    const filter = buildAndFilter(filterUnion(region.departements)(codeInseeStartWithFilterTemplate), applyFilters(filters));
    const [, headers] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }));
    return countFromHeaders(headers);
  };
