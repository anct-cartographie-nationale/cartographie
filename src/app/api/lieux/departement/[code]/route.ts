import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { toLieuListItem } from '@/external-api/inclusion-numerique/transfer/to-lieu-list-item';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { departementMatchingCode } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { type FiltersSchema, filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().catch(10)
});

const fetchDepartementLieux = async (departementCode: string, page: number, limit: number, filters: FiltersSchema) => {
  const filter = {
    'adresse->>code_insee': `like.${departementCode}%`,
    ...applyFilters(filters)
  };

  const [[lieux], [_, headers]] = await Promise.all([
    inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
      paginate: { limit, offset: (page - 1) * limit },
      select: LIEU_LIST_FIELDS,
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

const getCachedDepartementLieux = (departementCode: string, page: number, limit: number, filters: FiltersSchema) =>
  unstable_cache(
    () => fetchDepartementLieux(departementCode, page, limit, filters),
    ['departement-lieux', departementCode, String(page), String(limit), JSON.stringify(filters)],
    {
      revalidate: 21600,
      tags: ['departement-lieux']
    }
  )();

type RouteParams = {
  params: Promise<{ code: string }>;
};

export const GET = async (request: Request, { params }: RouteParams) => {
  const { code } = await params;
  const departement = departements.find(departementMatchingCode(code));

  if (!departement) {
    return NextResponse.json({ error: 'Departement not found' }, { status: 404 });
  }

  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());

  const { page, limit } = paginationSchema.parse(searchParams);
  const filters = filtersSchema.parse(searchParams);

  const result = await getCachedDepartementLieux(code, page, limit, filters);
  return Response.json(result);
};
