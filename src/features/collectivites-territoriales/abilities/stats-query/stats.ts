import { asCount, countFromHeaders } from '@/libraries/api/options';
import {
  type Departement,
  departementMatchingCode,
  filterDepartementsByTerritoire,
  filterRegionsByTerritoire,
  type Region
} from '@/libraries/collectivites';
import {
  applyFilters,
  type FiltersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';

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

export const fetchDepartementsStats = (filters: FiltersSchema): Promise<DepartementWithCount[]> =>
  Promise.all(filterDepartementsByTerritoire(filters).map((departement) => fetchDepartementCount(departement, filters)));

export const fetchRegionsStats = async (filters: FiltersSchema): Promise<RegionWithCount[]> => {
  const departementsAvecTotaux = await Promise.all(
    filterDepartementsByTerritoire(filters).map((departement) => fetchDepartementCount(departement, filters))
  );

  return filterRegionsByTerritoire(filters).map((region) => ({
    ...region,
    nombreLieux: region.departements.reduce(toRegionTotalCount(departementsAvecTotaux), 0)
  }));
};
