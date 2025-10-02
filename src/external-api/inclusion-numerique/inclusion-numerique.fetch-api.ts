import { env } from '@/env';
import { toQueryParams } from '@/libraries/api/options';
import { fetchApi } from '@/libraries/utils/fetch-api';
import type { DEPARTEMENTS_ROUTE, DepartementsRouteOptions, DepartementsRouteResponse } from './routes/departements';
import { LIEUX_ROUTE, type LieuxRouteOptions, type LieuxRouteResponse } from './routes/lieux';
import type { REGIONS_ROUTE, RegionsRouteOptions, RegionsRouteResponse } from './routes/regions';

type InclusionNumeriqueApiRoute = typeof REGIONS_ROUTE | typeof DEPARTEMENTS_ROUTE | typeof LIEUX_ROUTE;

type InclusionNumeriqueApiOptions = {
  [REGIONS_ROUTE]: RegionsRouteOptions;
  [DEPARTEMENTS_ROUTE]: DepartementsRouteOptions;
  [LIEUX_ROUTE]: LieuxRouteOptions;
};

type InclusionNumeriqueApiResponse = {
  [REGIONS_ROUTE]: RegionsRouteResponse;
  [DEPARTEMENTS_ROUTE]: DepartementsRouteResponse;
  [LIEUX_ROUTE]: LieuxRouteResponse;
};

export const inclusionNumeriqueFetchApi = async <TRoute extends InclusionNumeriqueApiRoute>(
  route: TRoute,
  options?: InclusionNumeriqueApiOptions[TRoute]
): Promise<InclusionNumeriqueApiResponse[TRoute]> => {
  const res = await fetchApi({
    baseUrl: 'https://api.inclusion-numerique.anct.gouv.fr',
    revalidate: 21600,
    token: env.INCLUSION_NUMERIQUE_API_TOKEN
  })(
    route,
    options
      ? toQueryParams(options, {
          order: '.',
          select: ','
        })
      : undefined
  );

  if (!res.ok) throw new Error('Failed to fetch data');

  return await res.json();
};
