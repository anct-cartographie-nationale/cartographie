import { env } from '@/env';
import { toQueryParams } from '@/libraries/api/options';
import { fetchApi } from '@/libraries/utils/fetch-api';
import { LIEUX_ROUTE, type LieuxRouteOptions, type LieuxRouteResponse } from './routes/lieux';

type InclusionNumeriqueApiRoute = typeof LIEUX_ROUTE;

type InclusionNumeriqueApiOptions = {
  [LIEUX_ROUTE]: LieuxRouteOptions;
};

type InclusionNumeriqueApiResponse = {
  [LIEUX_ROUTE]: LieuxRouteResponse;
};

export const inclusionNumeriqueFetchApi = async <TRoute extends InclusionNumeriqueApiRoute>(
  route: TRoute,
  options?: InclusionNumeriqueApiOptions[TRoute],
  headers?: Headers
): Promise<[InclusionNumeriqueApiResponse[TRoute], Headers]> => {
  const res = await fetchApi(
    {
      baseUrl: 'https://api.inclusion-numerique.anct.gouv.fr',
      revalidate: 21600,
      token: env.INCLUSION_NUMERIQUE_API_TOKEN
    },
    headers ?? new Headers()
  )(
    route,
    options
      ? toQueryParams(options, {
          order: '.',
          select: ','
        })
      : undefined
  );

  if (!res.ok) throw new Error('Failed to fetch data');

  return [await res.json(), res.headers];
};
