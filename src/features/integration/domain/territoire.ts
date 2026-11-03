import {
  type Departement,
  departementMatchingCode,
  getDepartementCodeFromInsee,
  type Region,
  regionMatchingDepartement
} from '@/libraries/collectivites';

export type TerritoireType = 'region' | 'departement' | 'epci' | 'commune';

export type TerritoireFilterType = 'regions' | 'departements' | 'communes';

export type Localisation = {
  latitude: number;
  longitude: number;
};

export type Territoire = {
  type: TerritoireType;
  code: string;
  nom: string;
  localisation: Localisation;
  zoom: number;
  path: string;
  filtre: {
    type: TerritoireFilterType;
    codes: string[];
  };
};

export type Commune = {
  code: string;
  nom: string;
  codeDepartement: string;
  localisation: Localisation;
};

export type Epci = {
  code: string;
  nom: string;
  localisation: Localisation;
  communes: string[];
};

const COMMUNE_ZOOM = 13;
const EPCI_ZOOM = 11;

const regionPath = (region: Region | undefined): string => (region ? `/${region.slug}` : '/');

const departementPath = (departement: Departement | undefined, regions: Region[]): string => {
  if (!departement) return '/';
  const region = regions.find(regionMatchingDepartement(departement));
  return region ? `/${region.slug}/${departement.slug}` : '/';
};

export const territoireFromRegion = (region: Region): Territoire => ({
  type: 'region',
  code: region.code,
  nom: region.nom,
  localisation: region.localisation,
  zoom: region.zoom,
  path: regionPath(region),
  filtre: { type: 'regions', codes: [region.code] }
});

export const territoireFromDepartement = (departement: Departement, regions: Region[]): Territoire => ({
  type: 'departement',
  code: departement.code,
  nom: departement.nom,
  localisation: departement.localisation,
  zoom: departement.zoom,
  path: departementPath(departement, regions),
  filtre: { type: 'departements', codes: [departement.code] }
});

export const territoireFromCommune = (commune: Commune, departements: Departement[], regions: Region[]): Territoire => ({
  type: 'commune',
  code: commune.code,
  nom: commune.nom,
  localisation: commune.localisation,
  zoom: COMMUNE_ZOOM,
  path: departementPath(departements.find(departementMatchingCode(commune.codeDepartement)), regions),
  filtre: { type: 'communes', codes: [commune.code] }
});

const mostRepresentedDepartementCode = (codesInsee: string[]): string | undefined => {
  const counts = new Map<string, number>();
  for (const codeInsee of codesInsee) {
    const codeDepartement = getDepartementCodeFromInsee(codeInsee);
    counts.set(codeDepartement, (counts.get(codeDepartement) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([, a], [, b]) => b - a)[0]?.[0];
};

export const territoireFromEpci = (epci: Epci, departements: Departement[], regions: Region[]): Territoire => ({
  type: 'epci',
  code: epci.code,
  nom: epci.nom,
  localisation: epci.localisation,
  zoom: EPCI_ZOOM,
  path: departementPath(departements.find(departementMatchingCode(mostRepresentedDepartementCode(epci.communes))), regions),
  filtre: { type: 'communes', codes: epci.communes }
});
