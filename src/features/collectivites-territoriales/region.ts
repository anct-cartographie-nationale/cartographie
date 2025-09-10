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
  (region: { slug: string }): boolean =>
    region.slug === slug;

export const matchingDepartementsFrom =
  ({ departements }: { departements: string[] }) =>
  ({ code }: { code: string }): boolean =>
    departements.includes(code);

export const regionMatchingDepartement =
  ({ code }: { code: string }) =>
  ({ departements }: { departements: string[] }): boolean =>
    departements.includes(code);

export const matchingRegionCode =
  (region: { code: string }) =>
  ({ code }: { code: string }): boolean =>
    region.code === code;
