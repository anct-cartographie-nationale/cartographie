import {
  type Departement,
  departementMatchingCode,
  filterDepartementsByTerritoire,
  filterRegionsByTerritoire,
  type Region
} from '@/libraries/collectivites';
import type { FiltersSchema } from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux, getOpeningHoursCache, needsOpeningHoursCache } from '@/libraries/lieux-cache';
import { aggregateByDepartement } from './aggregate-by-departement';

export type RegionWithCount = Region & { nombreLieux: number };
export type DepartementWithCount = Departement & { nombreLieux: number };

const toRegionTotalCount = (departementsAvecTotaux: DepartementWithCount[]) => (total: number, code: string) =>
  total + (departementsAvecTotaux.find(departementMatchingCode(code))?.nombreLieux ?? 0);

export type AllStats = { regions: RegionWithCount[]; departements: DepartementWithCount[] };

export const fetchAllStats = async (filters: FiltersSchema): Promise<AllStats> => {
  const [allLieux, ohCache] = await Promise.all([
    getAllLieux(),
    needsOpeningHoursCache(filters) ? getOpeningHoursCache() : undefined
  ]);
  const filtered = filterLieux(allLieux, filters, undefined, ohCache);
  const codeInsees = filtered.map((lieu) => lieu.adresse.code_insee).filter(Boolean);
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
