import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import type { LieuDetails } from '@/features/lieux-inclusion-numerique/lieu-details';
import type { LieuListItem } from '@/features/lieux-inclusion-numerique/lieu-list-item';
import { API_BASE_URL, inject } from '@/libraries/injection';

export type RegionWithCount = Region & { nombreLieux: number };
export type DepartementWithCount = Departement & { nombreLieux: number };

const buildUrl = (path: string, searchParams?: URLSearchParams) => {
  const base = `${inject(API_BASE_URL)}${path}`;
  return searchParams?.toString() ? `${base}?${searchParams.toString()}` : base;
};

export const buildExportUrl = (path: string, searchParams?: URLSearchParams) => buildUrl(path, searchParams);

export const fetchRegionsStats = async (searchParams?: URLSearchParams): Promise<RegionWithCount[]> => {
  const response = await fetch(buildUrl('/stats/regions', searchParams));
  if (!response.ok) throw new Error('Failed to fetch regions stats');
  return response.json();
};

export const fetchDepartementsStats = async (searchParams?: URLSearchParams): Promise<DepartementWithCount[]> => {
  const response = await fetch(buildUrl('/stats/departements', searchParams));
  if (!response.ok) throw new Error('Failed to fetch departements stats');
  return response.json();
};

export const fetchTotalLieux = async (searchParams?: URLSearchParams): Promise<number> => {
  const response = await fetch(buildUrl('/stats/total', searchParams));
  if (!response.ok) throw new Error('Failed to fetch total lieux');
  const data = await response.json();
  return data.total;
};

export const fetchRegionTotalLieux = async (slug: string, searchParams?: URLSearchParams): Promise<number> => {
  const response = await fetch(buildUrl(`/stats/regions/${slug}`, searchParams));
  if (!response.ok) throw new Error('Failed to fetch region total lieux');
  const data = await response.json();
  return data.total;
};

export type DepartementLieuxResponse = {
  lieux: LieuListItem[];
  total: number;
};

export const fetchDepartementLieux = async (
  code: string,
  page: number = 1,
  limit: number = 10,
  searchParams?: URLSearchParams
): Promise<DepartementLieuxResponse> => {
  const params = new URLSearchParams(searchParams);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const response = await fetch(buildUrl(`/lieux/departement/${code}`, params));
  if (!response.ok) throw new Error('Failed to fetch departement lieux');
  return response.json();
};

export type LieuxResponse = {
  lieux: LieuListItem[];
  total: number;
};

export const fetchAllLieux = async (
  page: number = 1,
  limit: number = 24,
  searchParams?: URLSearchParams
): Promise<LieuxResponse> => {
  const params = new URLSearchParams(searchParams);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const response = await fetch(buildUrl('/lieux', params));
  if (!response.ok) throw new Error('Failed to fetch lieux');
  return response.json();
};

export const fetchRegionLieux = async (
  slug: string,
  page: number = 1,
  limit: number = 24,
  searchParams?: URLSearchParams
): Promise<LieuxResponse> => {
  const params = new URLSearchParams(searchParams);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const response = await fetch(buildUrl(`/lieux/region/${slug}`, params));
  if (!response.ok) throw new Error('Failed to fetch region lieux');
  return response.json();
};

export const fetchLieu = async (id: string): Promise<LieuDetails | null> => {
  const response = await fetch(buildUrl(`/lieux/${encodeURIComponent(id)}`));
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch lieu');
  return response.json();
};

export type LieuChunk = {
  id: string;
  nom: string;
  latitude: number;
  longitude: number;
};

export const fetchLieuxForChunk = async (
  latitude: number,
  longitude: number,
  searchParams?: URLSearchParams
): Promise<LieuChunk[]> => {
  const params = new URLSearchParams(searchParams);
  params.set('latitude', String(latitude));
  params.set('longitude', String(longitude));

  const response = await fetch(buildUrl('/lieux/chunk', params));
  if (!response.ok) {
    console.error(`Failed to fetch lieux for chunk [${latitude}, ${longitude}]`);
    return [];
  }
  return response.json();
};

export type LieuSearchResult = {
  id: string;
  nom: string;
  adresse: {
    numero_voie: string;
    repetition: string;
    nom_voie: string;
    commune: string;
    code_postal: string;
    code_insee: string;
  };
};

export const fetchLieuxSearch = async (query: string): Promise<LieuSearchResult[]> => {
  const response = await fetch(buildUrl(`/lieux/search?q=${encodeURIComponent(query)}`));
  if (!response.ok) throw new Error('Failed to fetch lieux search');
  return response.json();
};

export type MediateurLieu = {
  id: string;
  nom: string;
  commune: string;
  code_postal: string;
  code_insee: string;
  adresse: string;
};

export type MediateurSearchResult = {
  prenom: string;
  nom: string;
  lieux: MediateurLieu[];
};

export const fetchMediateursSearch = async (query: string): Promise<MediateurSearchResult[]> => {
  const response = await fetch(buildUrl(`/mediateurs/search?q=${encodeURIComponent(query)}`));
  if (!response.ok) throw new Error('Failed to fetch mediateurs search');
  return response.json();
};
