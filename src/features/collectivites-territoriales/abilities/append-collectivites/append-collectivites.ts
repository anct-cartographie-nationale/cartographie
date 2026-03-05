import {
  departementMatchingCode,
  departements,
  getDepartementCodeFromInsee,
  regionMatchingDepartement,
  regions
} from '@/libraries/collectivites';

export const appendCollectivites = <T extends { adresse: { code_insee: string } }>(lieu: T) => {
  const code = getDepartementCodeFromInsee(lieu.adresse.code_insee ?? '');

  return {
    ...lieu,
    departement: departements.find(departementMatchingCode(code))?.slug ?? '',
    region: regions.find(regionMatchingDepartement({ code }))?.slug ?? ''
  };
};
