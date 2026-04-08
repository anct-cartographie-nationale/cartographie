import {
  type Departement,
  departementMatchingCode,
  filterDepartementsByTerritoire,
  filterRegionsByTerritoire,
  type Region
} from '@/libraries/collectivites';
import { applyFilters, type FiltersSchema, inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/libraries/inclusion-numerique-api';
import { aggregateByDepartement } from './aggregate-by-departement';

export type RegionWithCount = Region & { nombreLieux: number };
export type DepartementWithCount = Departement & { nombreLieux: number };

type CodeInseeResponse = { code_insee: string }[];

const fetchAllCodeInsee = async (filters: FiltersSchema): Promise<string[]> => {
  const [data] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    select: ['adresse->>code_insee'] as never,
    filter: applyFilters(filters)
  });

  return (data as unknown as CodeInseeResponse).map((row) => row.code_insee).filter(Boolean);
};

const toRegionTotalCount = (departementsAvecTotaux: DepartementWithCount[]) => (total: number, code: string) =>
  total + (departementsAvecTotaux.find(departementMatchingCode(code))?.nombreLieux ?? 0);

export type AllStats = { regions: RegionWithCount[]; departements: DepartementWithCount[] };

export const fetchAllStats = async (filters: FiltersSchema): Promise<AllStats> => {
  const codeInsees = await fetchAllCodeInsee(filters);
  const countsByDept = aggregateByDepartement(codeInsees);

  const departements = filterDepartementsByTerritoire(filters).map((dept) => ({
    ...dept,
    nombreLieux: countsByDept.get(dept.code) ?? 0
  }));

  const regions = filterRegionsByTerritoire(filters).map((region) => ({
    ...region,
    nombreLieux: region.departements.reduce(toRegionTotalCount(departements), 0)
  }));

  return { regions, departements };
};

export const fetchDepartementsStats = async (filters: FiltersSchema): Promise<DepartementWithCount[]> =>
  (await fetchAllStats(filters)).departements;

export const fetchRegionsStats = async (filters: FiltersSchema): Promise<RegionWithCount[]> =>
  (await fetchAllStats(filters)).regions;
