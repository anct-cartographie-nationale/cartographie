import { unstable_cache } from 'next/cache';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteOptions } from '@/external-api/inclusion-numerique';
import { type Departement, departementMatchingCode } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import type { Region } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { type FiltersSchema, filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';

const toRegionTotalCount =
  (departementsAvecTotaux: (Departement & { nombreLieux: number })[]) => (total: number, code: string) =>
    total + (departementsAvecTotaux.find(departementMatchingCode(code))?.nombreLieux ?? 0);

const fetchDepartementCount = async (departement: Departement, filters: FiltersSchema) => {
  const [_, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({
      filter: { 'adresse->>code_insee': `like.${departement.code}*`, ...applyFilters(filters) }
    })
  );

  return { ...departement, nombreLieux: countFromHeaders(headers) };
};

const fetchRegionsStats = async (filters: FiltersSchema) => {
  const departementsAvecTotaux: (Departement & { nombreLieux: number })[] = await Promise.all(
    departements.map((departement: Departement) => fetchDepartementCount(departement, filters))
  );

  return regions.map((region: Region) => ({
    ...region,
    nombreLieux: region.departements.reduce(toRegionTotalCount(departementsAvecTotaux), 0)
  }));
};

const getCachedRegionsStats = (filters: FiltersSchema) =>
  unstable_cache(() => fetchRegionsStats(filters), ['regions-stats', JSON.stringify(filters)], {
    revalidate: 21600,
    tags: ['regions-stats']
  })();

export const GET = async (request: Request) => {
  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());
  const filters = filtersSchema.parse(searchParams);

  const regionsAvecTotaux = await getCachedRegionsStats(filters);
  return Response.json(regionsAvecTotaux);
};
