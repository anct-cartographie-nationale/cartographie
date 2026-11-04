import { z } from 'zod';

const coordinate = (min: number, max: number) => z.string().min(1).transform(Number).pipe(z.number().min(min).max(max));

export const autourSchema = z.object({
  lat: coordinate(-90, 90),
  lng: coordinate(-180, 180),
  adresse: z.string().trim().min(1).max(200).optional().catch(undefined),
  commune: z
    .string()
    .regex(/^(\d{5}|2[AB]\d{3})$/)
    .optional()
    .catch(undefined),
  geolocalise: z.literal('1').optional().catch(undefined)
});

export type Autour = z.infer<typeof autourSchema>;

export const AUTOUR_PATH = '/autour';

const AUTOUR_PARAMS = ['lat', 'lng', 'adresse', 'commune', 'geolocalise'] as const;

export const withoutAutourParams = (searchParams: URLSearchParams): URLSearchParams => {
  const remaining = new URLSearchParams(searchParams);
  for (const param of AUTOUR_PARAMS) remaining.delete(param);
  return remaining;
};

export const autourHref = ({ lat, lng, adresse, commune, geolocalise }: Autour, searchParams: URLSearchParams): string => {
  const params = withoutAutourParams(searchParams);
  params.delete('page');
  params.set('lat', String(lat));
  params.set('lng', String(lng));
  if (adresse != null) params.set('adresse', adresse);
  if (commune != null) params.set('commune', commune);
  if (geolocalise != null) params.set('geolocalise', geolocalise);
  return `${AUTOUR_PATH}?${params}`;
};

export const autourKey = ({ lat, lng }: Pick<Autour, 'lat' | 'lng'>): string => `${lat},${lng}`;

export const isMapCentreAutour = ({ adresse, geolocalise }: Pick<Autour, 'adresse' | 'geolocalise'>): boolean =>
  adresse == null && geolocalise == null;

export const autourLocalisation = (autour: Autour): { latitude: number; longitude: number } | undefined =>
  isMapCentreAutour(autour) ? undefined : { latitude: autour.lat, longitude: autour.lng };

export const autourNavigation = (pathname: string, searchParams: URLSearchParams): 'push' | 'replace' =>
  pathname === AUTOUR_PATH && !searchParams.has('adresse') && !searchParams.has('geolocalise') ? 'replace' : 'push';

const URL_PARTS = /^([^?#]*)(?:\?([^#]*))?(#.*)?$/;

export const withoutAutourParamsInUrl = (url: string): string => {
  const [, path = '', query, hash = ''] = url.match(URL_PARTS) ?? [];
  const searchParams = new URLSearchParams(query);
  if (!AUTOUR_PARAMS.some((param) => searchParams.has(param))) return url;
  const remaining = withoutAutourParams(searchParams).toString();
  return `${path}${remaining ? `?${remaining}` : ''}${hash}`;
};
