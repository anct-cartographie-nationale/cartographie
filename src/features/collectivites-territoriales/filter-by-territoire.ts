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
  (territoires: string[]) => (d: Departement) => boolean
> = {
  regions: (territoires) => {
    const departementCodes = (regions as Region[]).filter((r) => territoires.includes(r.code)).flatMap((r) => r.departements);
    return (d) => departementCodes.includes(d.code);
  },
  departements: (territoires) => (d) => territoires.includes(d.code),
  communes: (territoires) => {
    const deptPrefixes = territoires.map(getDeptCodeFromCommune);
    return (d) => deptPrefixes.includes(d.code);
  }
};

const REGION_FILTERS: Record<
  NonNullable<TerritoireParams['territoire_type']>,
  (territoires: string[]) => (r: Region) => boolean
> = {
  regions: (territoires) => (r) => territoires.includes(r.code),
  departements: (territoires) => (r) => r.departements.some((d) => territoires.includes(d)),
  communes: (territoires) => {
    const deptPrefixes = territoires.map(getDeptCodeFromCommune);
    return (r) => r.departements.some((d) => deptPrefixes.includes(d));
  }
};

export const filterDepartementsByTerritoire = ({ territoire_type, territoires }: TerritoireParams): Departement[] =>
  territoire_type && territoires?.length
    ? (departements as Departement[]).filter(DEPARTEMENT_FILTERS[territoire_type](territoires))
    : (departements as Departement[]);

export const filterRegionsByTerritoire = ({ territoire_type, territoires }: TerritoireParams): Region[] =>
  territoire_type && territoires?.length
    ? (regions as Region[]).filter(REGION_FILTERS[territoire_type](territoires))
    : (regions as Region[]);
