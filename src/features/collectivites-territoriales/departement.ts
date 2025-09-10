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

export const departementMatchingCode =
  (code: string) =>
  (departement: { code: string }): boolean =>
    departement.code === code;

export const departementMatchingSlug =
  (slug: string | undefined) =>
  (departement: { slug: string }): boolean =>
    departement.slug === slug;

export const matchingDepartementCode =
  (departement: Departement) =>
  ({ code }: { code: string }): boolean =>
    departement.code === code;
