import type { FilterOptions, OrderOptions, PaginateOptions, SelectOptions } from '@/libraries/api/options';

export const LIEUX_ROUTE = 'carto' as const;

export type LieuxRouteOptions = PaginateOptions &
  SelectOptions<LieuxRouteResponse[number]> &
  FilterOptions<LieuxRouteResponse[number]> &
  OrderOptions<LieuxRouteResponse[number]>;

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
  modalites_acces?: string;
}[];

export const LIEU_LIST_FIELDS: (keyof LieuxRouteResponse[number])[] = [
  'id',
  'nom',
  'adresse',
  'commune',
  'code_postal',
  'code_insee',
  'latitude',
  'longitude',
  'prise_rdv',
  'horaires',
  'dispositif_programmes_nationaux',
  'modalites_acces'
];
