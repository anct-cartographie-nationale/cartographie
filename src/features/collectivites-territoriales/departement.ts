import type { Region } from './region';

export type Departement = {
  code: string;
  nom: string;
  slug: string;
  zoom: number;
  localisation: {
    latitude: number;
    longitude: number;
  };
};

export const departementMatchingSlug =
  (slug: string | undefined) =>
  (departement: Departement): boolean =>
    departement.slug === slug;

export const departementMatchingCode =
  (code: string) =>
  ({ departements }: Region): boolean =>
    departements.includes(code);
