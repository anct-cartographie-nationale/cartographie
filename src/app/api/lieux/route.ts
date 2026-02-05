import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import {
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { toLieuListItem } from '@/external-api/inclusion-numerique/transfer/to-lieu-list-item';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { type FiltersSchema, filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().catch(24)
});

const fetchAllLieux = async (page: number, limit: number, filters: FiltersSchema) => {
  const filter = applyFilters(filters);

  const [[lieux], [_, headers]] = await Promise.all([
    inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
      paginate: { limit, offset: (page - 1) * limit },
      select: [...LIEU_LIST_FIELDS, 'telephone'],
      filter,
      order: ['nom', 'asc']
    }),
    inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }))
  ]);

  return {
    lieux: lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu))),
    total: countFromHeaders(headers)
  };
};

const getCachedAllLieux = (page: number, limit: number, filters: FiltersSchema) =>
  unstable_cache(
    () => fetchAllLieux(page, limit, filters),
    ['all-lieux', String(page), String(limit), JSON.stringify(filters)],
    {
      revalidate: 21600,
      tags: ['all-lieux']
    }
  )();

export const GET = async (request: Request) => {
  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());

  const { page, limit } = paginationSchema.parse(searchParams);
  const filters = filtersSchema.parse(searchParams);

  const result = await getCachedAllLieux(page, limit, filters);
  return Response.json(result);
};
