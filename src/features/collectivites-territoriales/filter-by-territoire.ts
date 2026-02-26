import type { Departement } from './departement';
import departements from './departements.json';
import type { Region } from './region';
import regions from './regions.json';

type TerritoireParams = {
  territoire_type?: 'regions' | 'departements' | 'communes' | undefined;
  territoires?: string[] | undefined;
};

const getDeptCodeFromCommune = (code: string): string => (code.startsWith('97') ? code.substring(0, 3) : code.substring(0, 2));

const toDeptCodes = (communeCodes: string[]): string[] => communeCodes.map(getDeptCodeFromCommune);

const getDeptCodesFromRegions = (regionCodes: string[]): string[] =>
  regions.filter((region) => regionCodes.includes(region.code)).flatMap((region) => region.departements);

const DEPARTEMENT_FILTERS: Record<
  NonNullable<TerritoireParams['territoire_type']>,
  (territoires: string[]) => (departement: Departement) => boolean
> = {
  regions: (territoires) => (departement) => getDeptCodesFromRegions(territoires).includes(departement.code),
  departements: (territoires) => (departement) => territoires.includes(departement.code),
  communes: (territoires) => (departement) => toDeptCodes(territoires).includes(departement.code)
};

const REGION_FILTERS: Record<
  NonNullable<TerritoireParams['territoire_type']>,
  (territoires: string[]) => (region: Region) => boolean
> = {
  regions: (territoires) => (region) => territoires.includes(region.code),
  departements: (territoires) => (region) => region.departements.some((code) => territoires.includes(code)),
  communes: (territoires) => (region) => region.departements.some((code) => toDeptCodes(territoires).includes(code))
};

export const filterDepartementsByTerritoire = ({ territoire_type, territoires }: TerritoireParams): Departement[] =>
  territoire_type && territoires?.length
    ? departements.filter(DEPARTEMENT_FILTERS[territoire_type](territoires))
    : departements;

export const filterRegionsByTerritoire = ({ territoire_type, territoires }: TerritoireParams): Region[] =>
  territoire_type && territoires?.length ? regions.filter(REGION_FILTERS[territoire_type](territoires)) : regions;
