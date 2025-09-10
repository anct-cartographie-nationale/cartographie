import type { FilterOptions, PaginateOptions, SelectOptions } from '@/libraries/api/options';

export const LIEUX_ROUTE = 'carto' as const;

export type LieuxRouteOptions = PaginateOptions &
  SelectOptions<LieuxRouteResponse[number]> &
  FilterOptions<LieuxRouteResponse[number]>;

export type LieuxRouteResponse = {
  id: string;
  nom: string;
  adresse: string;
  commune: string;
  code_postal: string;
  code_insee: string;
  latitude?: number;
  longitude?: number;
  prise_rdv?: string;
  horaires?: string;
  dispositif_programmes_nationaux?: string;
}[];
