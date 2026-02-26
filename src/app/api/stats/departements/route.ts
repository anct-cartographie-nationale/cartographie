import { unstable_cache } from 'next/cache';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteOptions } from '@/external-api/inclusion-numerique';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import { filterDepartementsByTerritoire } from '@/features/collectivites-territoriales/filter-by-territoire';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { type FiltersSchema, filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';

const fetchDepartementCount = async (departement: Departement, filters: FiltersSchema) => {
  const [_, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({
      filter: { 'adresse->>code_insee': `like.${departement.code}*`, ...applyFilters(filters) }
    })
  );

  return { ...departement, nombreLieux: countFromHeaders(headers) };
};

const fetchDepartementsStats = async (filters: FiltersSchema) =>
  Promise.all(filterDepartementsByTerritoire(filters).map((departement) => fetchDepartementCount(departement, filters)));

const getCachedDepartementsStats = (filters: FiltersSchema) =>
  unstable_cache(() => fetchDepartementsStats(filters), ['departements-stats', JSON.stringify(filters)], {
    revalidate: 21600,
    tags: ['departements-stats']
  })();

export const GET = async (request: Request) => {
  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());
  const filters = filtersSchema.parse(searchParams);

  const departementsAvecTotaux = await getCachedDepartementsStats(filters);
  return Response.json(departementsAvecTotaux);
};
