import { env } from '@/env';
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

export const isResponseError = (error: unknown): error is ResponseError =>
  error instanceof Error && error.name === 'ResponseError';

const withStripNullsHeader = (headers: Headers): Headers => {
  headers.set('Accept', 'application/vnd.pgrst.array+json;nulls=stripped');
  return headers;
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
    withStripNullsHeader(headers ?? new Headers())
  )(route, options ? toQueryParams(options, separators[route]) : undefined);

  if (!res.ok) {
    throw new ResponseError('Failed to fetch data from inclusion-numerique API', res);
  }

  return [await res.json(), res.headers];
};
