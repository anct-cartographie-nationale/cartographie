import { asCount, countFromHeaders } from '@/libraries/api/options';
import {
  applyFilters,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';

export const countLieux = async (filters: FiltersSchema): Promise<number> => {
  const [, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({ filter: applyFilters(filters) })
  );
  return countFromHeaders(headers);
};
