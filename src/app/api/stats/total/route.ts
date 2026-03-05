import { unstable_cache } from 'next/cache';
import { asCount, countFromHeaders } from '@/libraries/api/options';
import {
  applyFilters,
  type FiltersSchema,
  filtersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';

const fetchTotalLieux = async (filters: FiltersSchema) => {
  const [_, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({ filter: applyFilters(filters) })
  );

  return countFromHeaders(headers);
};

const getCachedTotalLieux = (filters: FiltersSchema) =>
  unstable_cache(() => fetchTotalLieux(filters), ['total-lieux', JSON.stringify(filters)], {
    revalidate: 21600,
    tags: ['total-lieux']
  })();

export const GET = async (request: Request) => {
  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());
  const filters = filtersSchema.parse(searchParams);

  const total = await getCachedTotalLieux(filters);
  return Response.json({ total });
};
