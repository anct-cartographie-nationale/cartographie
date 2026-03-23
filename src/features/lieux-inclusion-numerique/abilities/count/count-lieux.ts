import { asCount, countFromHeaders } from '@/libraries/api/options';
import {
  buildCollectiviteFilter,
  type Collectivite,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';

export const countLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema): Promise<number> => {
    const [, headers] = await inclusionNumeriqueFetchApi(
      LIEUX_ROUTE,
      ...asCount<LieuxRouteOptions>({ filter: buildCollectiviteFilter(filters, collectivite) })
    );
    return countFromHeaders(headers);
  };
