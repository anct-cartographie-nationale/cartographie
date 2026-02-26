import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  codeInseeStartWithFilterTemplate,
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { toLieuListItem } from '@/external-api/inclusion-numerique/transfer/to-lieu-list-item';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { type FiltersSchema, filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, buildAndFilter, countFromHeaders, filterUnion } from '@/libraries/api/options';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().catch(24)
});

const fetchRegionLieux = async (region: Region, page: number, limit: number, filters: FiltersSchema) => {
  const filter = buildAndFilter(filterUnion(region.departements)(codeInseeStartWithFilterTemplate), applyFilters(filters));

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

const getCachedRegionLieux = (region: Region, page: number, limit: number, filters: FiltersSchema) =>
  unstable_cache(
    () => fetchRegionLieux(region, page, limit, filters),
    ['region-lieux', region.slug, String(page), String(limit), JSON.stringify(filters)],
    {
      revalidate: 21600,
      tags: ['region-lieux']
    }
  )();

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export const GET = async (request: Request, { params }: RouteParams) => {
  const { slug } = await params;
  const region = (regions as Region[]).find(regionMatchingSlug(slug));

  if (!region) {
    return NextResponse.json({ error: 'Region not found' }, { status: 404 });
  }

  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());

  const { page, limit } = paginationSchema.parse(searchParams);
  const filters = filtersSchema.parse(searchParams);

  const result = await getCachedRegionLieux(region, page, limit, filters);
  return Response.json(result);
};
