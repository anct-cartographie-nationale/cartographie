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

class ResponseError extends Error {
  constructor(
    message: string,
    public response: Response
  ) {
    super(message);
    this.name = 'ResponseError';
  }
}

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
  )(
    route,
    options
      ? toQueryParams(options, {
          order: '.',
          select: ','
        })
      : undefined
  );

  if (!res.ok) {
    throw new ResponseError('Failed to fetch data from inclusion-numerique API', res);
  }

  return [await res.json(), res.headers];
};
