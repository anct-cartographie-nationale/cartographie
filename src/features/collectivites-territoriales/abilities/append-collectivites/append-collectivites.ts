import { type Departement, departements, getDepartementCodeFromInsee, type Region, regions } from '@/libraries/collectivites';

const departementByCode = new Map<string, Departement>(departements.map((d) => [d.code, d]));

const regionByDepartementCode = new Map<string, Region>(
  regions.flatMap((region) => region.departements.map((code) => [code, region]))
);

export const appendCollectivites = <T extends { adresse: { code_insee: string } }>(lieu: T) => {
  const code = getDepartementCodeFromInsee(lieu.adresse.code_insee ?? '');

  return {
    ...lieu,
    departement: departementByCode.get(code)?.slug ?? '',
    region: regionByDepartementCode.get(code)?.slug ?? ''
  };
};
