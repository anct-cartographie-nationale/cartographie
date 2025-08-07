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
