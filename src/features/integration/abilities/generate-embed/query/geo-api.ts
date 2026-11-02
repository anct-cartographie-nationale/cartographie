import type { Point } from 'geojson';
import type { Commune, CommuneAvecPopulation, Epci } from '@/features/integration/domain';

const GEO_API_URL = 'https://geo.api.gouv.fr';
const SUGGESTIONS_LIMIT = 8;

type GeoCommune = {
  code: string;
  nom: string;
  codeDepartement: string;
  population?: number;
  centre?: Point;
};

type GeoEpci = {
  code: string;
  nom: string;
};

const fetchJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${GEO_API_URL}${path}`);
  if (!res.ok) throw new Error(`geo.api.gouv.fr ${res.status} on ${path}`);
  return res.json() as Promise<T>;
};

const fetchJsonOrEmpty = <T>(path: string): Promise<T[]> =>
  fetchJson<T | T[]>(path)
    .then((data) => (Array.isArray(data) ? data : [data]))
    .catch(() => []);

const toCommune = ({ code, nom, codeDepartement, centre, population = 0 }: GeoCommune): CommuneAvecPopulation => ({
  code,
  nom,
  codeDepartement,
  population,
  localisation: { latitude: centre?.coordinates[1] ?? 0, longitude: centre?.coordinates[0] ?? 0 }
});

const hasLocalisation = ({ localisation }: Commune): boolean => localisation.latitude !== 0 && localisation.longitude !== 0;

const uniqueByCode = <T extends { code: string }>(items: T[]): T[] => [
  ...new Map(items.map((item) => [item.code, item])).values()
];

const COMMUNE_FIELDS = 'fields=nom,code,codeDepartement,centre,population';

export const searchCommunes = async (query: string): Promise<Commune[]> => {
  const q = query.trim();
  const byPostalOrInseeCode = /^\d{5}$/.test(q)
    ? [
        fetchJsonOrEmpty<GeoCommune>(`/communes/${q}?${COMMUNE_FIELDS}`),
        fetchJsonOrEmpty<GeoCommune>(`/communes?codePostal=${q}&${COMMUNE_FIELDS}&limit=${SUGGESTIONS_LIMIT}`)
      ]
    : [
        fetchJsonOrEmpty<GeoCommune>(
          `/communes?nom=${encodeURIComponent(q)}&${COMMUNE_FIELDS}&boost=population&limit=${SUGGESTIONS_LIMIT}`
        )
      ];
  const results = await Promise.all(byPostalOrInseeCode);
  return uniqueByCode(results.flat().map(toCommune).filter(hasLocalisation));
};

export const searchEpcis = async (query: string): Promise<Epci[]> => {
  const q = query.trim();
  const results = /^\d{9}$/.test(q)
    ? await fetchJsonOrEmpty<GeoEpci>(`/epcis/${q}?fields=nom,code`)
    : await fetchJsonOrEmpty<GeoEpci>(`/epcis?nom=${encodeURIComponent(q)}&fields=nom,code&limit=${SUGGESTIONS_LIMIT}`);
  return results.map(({ code, nom }) => ({ code, nom }));
};

export const fetchEpciCommunes = async (epciCode: string): Promise<CommuneAvecPopulation[]> =>
  (await fetchJson<GeoCommune[]>(`/epcis/${epciCode}/communes?${COMMUNE_FIELDS}&limit=1000`)).map(toCommune);
