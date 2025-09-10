export const REGIONS_ROUTE = 'carto_region' as const;

export type RegionsRouteOptions = never;

export type RegionsRouteResponse = {
  code: string;
  nom: string;
  nombre_lieux: number;
}[];
