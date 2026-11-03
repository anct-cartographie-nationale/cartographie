export const GEOCODAGE_SEARCH_URL = 'https://data.geopf.fr/geocodage/search';

export const REQUEST_TIMEOUT_MS = 10_000;

export const fetchGeocodage = async <T>(params: Record<string, string>): Promise<T> => {
  const res = await fetch(`${GEOCODAGE_SEARCH_URL}?${new URLSearchParams(params)}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};
