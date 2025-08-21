import type { Departement } from '@/features/collectivites-territoriales/departement';

export type Region = {
  code: string;
  departements: string[];
  nom: string;
  slug: string;
  zoom: number;
  localisation: {
    latitude: number;
    longitude: number;
  };
};

export const regionMatchingSlug =
  (slug: string | undefined) =>
  (region: Region): boolean =>
    region.slug === slug;

export const regionMatchingDepartement =
  ({ code }: Departement) =>
  ({ departements }: Region): boolean =>
    departements.includes(code);
