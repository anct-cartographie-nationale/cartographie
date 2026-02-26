import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import {
  codeInseeStartWithFilterTemplate,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { type FiltersSchema, filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, buildAndFilter, countFromHeaders, filterUnion } from '@/libraries/api/options';

const fetchRegionTotalLieux = async (region: Region, filters: FiltersSchema) => {
  const [_, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({
      filter: buildAndFilter(filterUnion(region.departements)(codeInseeStartWithFilterTemplate), applyFilters(filters))
    })
  );

  return countFromHeaders(headers);
};

const getCachedRegionTotalLieux = (region: Region, filters: FiltersSchema) =>
  unstable_cache(() => fetchRegionTotalLieux(region, filters), ['region-total', region.slug, JSON.stringify(filters)], {
    revalidate: 21600,
    tags: ['region-total']
  })();

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export const GET = async (request: Request, { params }: RouteParams) => {
  const { slug } = await params;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) {
    return NextResponse.json({ error: 'Region not found' }, { status: 404 });
  }

  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());
  const filters = filtersSchema.parse(searchParams);

  const total = await getCachedRegionTotalLieux(region, filters);
  return Response.json({ total });
};
