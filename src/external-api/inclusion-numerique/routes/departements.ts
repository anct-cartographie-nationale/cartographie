export const DEPARTEMENTS_ROUTE = 'carto_departement' as const;

export type DepartementsRouteOptions = never;

export type DepartementsRouteResponse = {
  code: string;
  nom: string;
  nombre_lieux: number;
}[];
