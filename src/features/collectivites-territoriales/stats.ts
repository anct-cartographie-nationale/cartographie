import { unstable_cache } from 'next/cache';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteOptions } from '@/external-api/inclusion-numerique';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import type { FiltersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';
import type { Departement } from './departement';
import { departementMatchingCode } from './departement';
import { filterDepartementsByTerritoire, filterRegionsByTerritoire } from './filter-by-territoire';
import type { Region } from './region';

export type RegionWithCount = Region & { nombreLieux: number };
export type DepartementWithCount = Departement & { nombreLieux: number };

const toRegionTotalCount = (departementsAvecTotaux: DepartementWithCount[]) => (total: number, code: string) =>
  total + (departementsAvecTotaux.find(departementMatchingCode(code))?.nombreLieux ?? 0);

const fetchDepartementCount = async (departement: Departement, filters: FiltersSchema): Promise<DepartementWithCount> => {
  const [_, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({
      filter: { 'adresse->>code_insee': `like.${departement.code}*`, ...applyFilters(filters) }
    })
  );

  return { ...departement, nombreLieux: countFromHeaders(headers) };
};

const fetchDepartementsStats = async (filters: FiltersSchema): Promise<DepartementWithCount[]> =>
  Promise.all(filterDepartementsByTerritoire(filters).map((departement) => fetchDepartementCount(departement, filters)));

const fetchRegionsStats = async (filters: FiltersSchema): Promise<RegionWithCount[]> => {
  const departementsAvecTotaux = await Promise.all(
    filterDepartementsByTerritoire(filters).map((departement) => fetchDepartementCount(departement, filters))
  );

  return filterRegionsByTerritoire(filters).map((region) => ({
    ...region,
    nombreLieux: region.departements.reduce(toRegionTotalCount(departementsAvecTotaux), 0)
  }));
};

export const getCachedRegionsStats = (filters: FiltersSchema): Promise<RegionWithCount[]> =>
  unstable_cache(() => fetchRegionsStats(filters), ['regions-stats', JSON.stringify(filters)], {
    revalidate: 21600,
    tags: ['regions-stats']
  })();

export const getCachedDepartementsStats = (filters: FiltersSchema): Promise<DepartementWithCount[]> =>
  unstable_cache(() => fetchDepartementsStats(filters), ['departements-stats', JSON.stringify(filters)], {
    revalidate: 21600,
    tags: ['departements-stats']
  })();
