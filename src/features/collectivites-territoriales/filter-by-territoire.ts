import type { Departement } from './departement';
import departements from './departements.json';
import type { Region } from './region';
import regions from './regions.json';

type TerritoireParams = {
  territoire_type?: 'regions' | 'departements' | 'communes' | undefined;
  territoires?: string[] | undefined;
};

const getDeptCodeFromCommune = (code: string): string => (code.startsWith('97') ? code.substring(0, 3) : code.substring(0, 2));

const DEPARTEMENT_FILTERS: Record<
  NonNullable<TerritoireParams['territoire_type']>,
  (territoires: string[]) => (departement: Departement) => boolean
> = {
  regions: (territoires) => (departement) =>
    regions
      .filter((region) => territoires.includes(region.code))
      .flatMap((region) => region.departements)
      .includes(departement.code),
  departements: (territoires) => (departement) => territoires.includes(departement.code),
  communes: (territoires) => (departement) => territoires.map(getDeptCodeFromCommune).includes(departement.code)
};

const REGION_FILTERS: Record<
  NonNullable<TerritoireParams['territoire_type']>,
  (territoires: string[]) => (r: Region) => boolean
> = {
  regions: (territoires) => (region) => territoires.includes(region.code),
  departements: (territoires) => (region) => region.departements.some((d) => territoires.includes(d)),
  communes: (territoires) => (region) => region.departements.some((d) => territoires.map(getDeptCodeFromCommune).includes(d))
};

export const filterDepartementsByTerritoire = ({ territoire_type, territoires }: TerritoireParams): Departement[] =>
  territoire_type && territoires?.length
    ? departements.filter(DEPARTEMENT_FILTERS[territoire_type](territoires))
    : departements;

export const filterRegionsByTerritoire = ({ territoire_type, territoires }: TerritoireParams): Region[] =>
  territoire_type && territoires?.length ? regions.filter(REGION_FILTERS[territoire_type](territoires)) : regions;
