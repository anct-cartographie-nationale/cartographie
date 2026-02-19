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

const getDepartementsToQuery = (filters: FiltersSchema): Departement[] => {
  const { territoire_type, territoires } = filters;

  if (!territoire_type || !territoires || territoires.length === 0) {
    return departements as Departement[];
  }

  switch (territoire_type) {
    case 'regions': {
      const regionCodes = new Set(territoires);
      const departementCodes = (regions as Region[]).filter((r) => regionCodes.has(r.code)).flatMap((r) => r.departements);
      return (departements as Departement[]).filter((d) => departementCodes.includes(d.code));
    }
    case 'departements': {
      const deptCodes = new Set(territoires);
      return (departements as Departement[]).filter((d) => deptCodes.has(d.code));
    }
    case 'communes': {
      const deptPrefixes = new Set(
        territoires.map((code) => (code.startsWith('97') ? code.substring(0, 3) : code.substring(0, 2)))
      );
      return (departements as Departement[]).filter((d) => deptPrefixes.has(d.code));
    }
    default:
      return departements as Departement[];
  }
};

const getRegionsToReturn = (filters: FiltersSchema): Region[] => {
  const { territoire_type, territoires } = filters;

  if (!territoire_type || !territoires || territoires.length === 0) {
    return regions as Region[];
  }

  switch (territoire_type) {
    case 'regions': {
      const regionCodes = new Set(territoires);
      return (regions as Region[]).filter((r) => regionCodes.has(r.code));
    }
    case 'departements': {
      const deptCodes = new Set(territoires);
      return (regions as Region[]).filter((r) => r.departements.some((d) => deptCodes.has(d)));
    }
    case 'communes': {
      const deptPrefixes = new Set(
        territoires.map((code) => (code.startsWith('97') ? code.substring(0, 3) : code.substring(0, 2)))
      );
      return (regions as Region[]).filter((r) => r.departements.some((d) => deptPrefixes.has(d)));
    }
    default:
      return regions as Region[];
  }
};

const fetchRegionsStats = async (filters: FiltersSchema) => {
  const departementsToBuild = getDepartementsToQuery(filters);
  const departementsAvecTotaux: (Departement & { nombreLieux: number })[] = await Promise.all(
    departementsToBuild.map((departement: Departement) => fetchDepartementCount(departement, filters))
  );

  const regionsToReturn = getRegionsToReturn(filters);
  return regionsToReturn.map((region: Region) => ({
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
