import { type Departement, departementMatchingCode } from './departement';
import departements from './departements.json';
import { getDepartementCodeFromInsee } from './get-departement-code';
import { type Region, regionMatchingDepartement } from './region';
import regions from './regions.json';

export const collectivitesFromInsee = (codeInsee: string): { region: Region; departement: Departement } | undefined => {
  const departement = (departements as Departement[]).find(departementMatchingCode(getDepartementCodeFromInsee(codeInsee)));
  const region = departement && (regions as Region[]).find(regionMatchingDepartement(departement));

  return departement && region ? { region, departement } : undefined;
};
