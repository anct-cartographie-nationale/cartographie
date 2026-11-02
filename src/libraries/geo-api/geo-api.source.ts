import { type Effect, tryPromise } from 'effect/Effect';
import type { GeoCommune } from './commune';
import type { GeoEpci } from './epci';

const GEO_API_URL = 'https://geo.api.gouv.fr';
const SUGGESTIONS_LIMIT = 8;
const COMMUNE_FIELDS = 'fields=nom,code,codeDepartement,centre,population';
const EPCI_FIELDS = 'fields=nom,code';

const fetchGeo = async <T>(path: string): Promise<T[]> => {
  const res = await fetch(`${GEO_API_URL}${path}`);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(res.statusText);
  const data: T | T[] = await res.json();
  return Array.isArray(data) ? data : [data];
};

const geoEffect = <T>(paths: string[]): Effect<T[], Error> =>
  tryPromise({
    try: async () => (await Promise.all(paths.map((path) => fetchGeo<T>(path)))).flat(),
    catch: (err) => new Error(`geo.api.gouv.fr fetch failed: ${err}`)
  });

const isInseeOrPostalCode = (query: string): boolean => /^\d{5}$/.test(query);

const isSiren = (query: string): boolean => /^\d{9}$/.test(query);

export const searchGeoCommunes = (query: string): Effect<GeoCommune[], Error> =>
  geoEffect<GeoCommune>(
    isInseeOrPostalCode(query)
      ? [`/communes/${query}?${COMMUNE_FIELDS}`, `/communes?codePostal=${query}&${COMMUNE_FIELDS}&limit=${SUGGESTIONS_LIMIT}`]
      : [`/communes?nom=${encodeURIComponent(query)}&${COMMUNE_FIELDS}&boost=population&limit=${SUGGESTIONS_LIMIT}`]
  );

export const searchGeoEpcis = (query: string): Effect<GeoEpci[], Error> =>
  geoEffect<GeoEpci>(
    isSiren(query)
      ? [`/epcis/${query}?${EPCI_FIELDS}`]
      : [`/epcis?nom=${encodeURIComponent(query)}&${EPCI_FIELDS}&limit=${SUGGESTIONS_LIMIT}`]
  );

export const fetchGeoEpciCommunes = (epciCode: string): Effect<GeoCommune[], Error> =>
  geoEffect<GeoCommune>([`/epcis/${epciCode}/communes?${COMMUNE_FIELDS}&limit=1000`]);
