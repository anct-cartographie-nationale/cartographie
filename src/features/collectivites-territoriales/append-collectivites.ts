import { departementMatchingCode } from './departement';
import departements from './departements.json';
import { regionMatchingDepartement } from './region';
import regions from './regions.json';

export const appendCollectivites = <T extends { adresse: { code_insee: string } }>(lieu: T) => {
  const code: string = lieu.adresse.code_insee?.startsWith('97')
    ? lieu.adresse.code_insee?.slice(0, 3)
    : lieu.adresse.code_insee?.slice(0, 2);

  return {
    ...lieu,
    departement: departements.find(departementMatchingCode(code))?.slug ?? '',
    region: regions.find(regionMatchingDepartement({ code }))?.slug ?? ''
  };
};
