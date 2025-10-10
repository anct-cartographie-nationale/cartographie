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
  complement_adresse?: string;
  commune: string;
  code_postal: string;
  code_insee: string;
  latitude?: number;
  longitude?: number;
  telephone?: string;
  courriels?: string;
  site_web?: string;
  horaires?: string;
  presentation_resume?: string;
  presentation_detail?: string;
  services: string;
  publics_specifiquement_adresses?: string;
  prise_en_charge_specifique?: string;
  frais_a_charge?: string;
  dispositif_programmes_nationaux?: string;
  formations_labels?: string;
  autres_formations_labels?: string;
  modalites_acces?: string;
  modalites_accompagnement?: string;
  fiche_acces_libre?: string;
  prise_rdv?: string;
  mediateurs?: { prenom: string; nom: string; email?: string; telephone?: string; label?: string[] }[];
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
