import { serverEnv } from '@/env.server';
import { toQueryParams } from '@/libraries/api/options';
import { fetchApi } from '@/libraries/utils/fetch-api';
import { LIEUX_ROUTE, type LieuxRouteOptions, type LieuxRouteResponse } from './routes/lieux';
import { MEDIATEURS_ROUTE, type MediateursRouteOptions, type MediateursRouteResponse } from './routes/mediateurs';

type InclusionNumeriqueApiRoute = typeof LIEUX_ROUTE | typeof MEDIATEURS_ROUTE;

type InclusionNumeriqueApiOptions = {
  [LIEUX_ROUTE]: LieuxRouteOptions;
  [MEDIATEURS_ROUTE]: MediateursRouteOptions;
};

type InclusionNumeriqueApiResponse = {
  [LIEUX_ROUTE]: LieuxRouteResponse;
  [MEDIATEURS_ROUTE]: MediateursRouteResponse;
};

class ResponseError extends Error {
  constructor(
    message: string,
    public response: Response
  ) {
    super(message);
    this.name = 'ResponseError';
  }
}

const separators: {
  [TRoute in InclusionNumeriqueApiRoute]: { [TOption in keyof InclusionNumeriqueApiOptions[TRoute]]: string };
} = {
  [LIEUX_ROUTE]: { order: '.', select: ',' },
  [MEDIATEURS_ROUTE]: {}
};

const withStripNullsHeader = (headers: Headers): Headers => {
  headers.set('Accept', 'application/vnd.pgrst.array+json;nulls=stripped');
  return headers;
};

const withRequiredCodeInsee = <TRoute extends InclusionNumeriqueApiRoute>(
  route: TRoute,
  options?: InclusionNumeriqueApiOptions[TRoute]
): InclusionNumeriqueApiOptions[TRoute] | undefined =>
  route === LIEUX_ROUTE
    ? ({
        ...options,
        filter: { 'adresse->>code_insee': 'not.is.null', ...options?.filter }
      } as InclusionNumeriqueApiOptions[TRoute])
    : options;

export const inclusionNumeriqueFetchApi = async <TRoute extends InclusionNumeriqueApiRoute>(
  route: TRoute,
  options?: InclusionNumeriqueApiOptions[TRoute],
  headers?: Headers,
  fetchOptions?: { noCache?: boolean }
): Promise<[InclusionNumeriqueApiResponse[TRoute], Headers]> => {
  const finalOptions = withRequiredCodeInsee(route, options);
  const res = await fetchApi(
    {
      baseUrl: 'https://api.inclusion-numerique.anct.gouv.fr',
      revalidate: 21600,
      token: serverEnv.INCLUSION_NUMERIQUE_API_TOKEN,
      ...(fetchOptions?.noCache != null && { noCache: fetchOptions.noCache })
    },
    withStripNullsHeader(headers ?? new Headers())
  )(route, finalOptions ? toQueryParams(finalOptions, separators[route]) : undefined);

  if (!res.ok) {
    throw new ResponseError('Failed to fetch data from inclusion-numerique API', res);
  }

  return [await res.json(), res.headers];
};
