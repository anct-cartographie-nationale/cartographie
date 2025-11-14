import type { FilterOptions } from '@/libraries/api/options';

export const MEDIATEURS_ROUTE = 'rpc/get_carto_mediateur' as const;

export type MediateursRouteOptions = FilterOptions<{
  name: string;
}>;

type Lieu = {
  id: string;
  nom: string;
  pivot: string;
  adresse: string;
  commune: string;
  latitude?: number;
  longitude?: number;
  code_insee: string;
  code_postal: string;
  complement_adresse?: string;
};

export type MediateursRouteResponse = {
  prenom: string;
  nom: string;
  lieux: Lieu[];
}[];
