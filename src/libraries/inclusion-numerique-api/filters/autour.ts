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
    .catch(undefined)
});

export type Autour = z.infer<typeof autourSchema>;

export const AUTOUR_PATH = '/autour';

const AUTOUR_PARAMS = ['lat', 'lng', 'adresse', 'commune'] as const;

export const withoutAutourParams = (searchParams: URLSearchParams): URLSearchParams => {
  const remaining = new URLSearchParams(searchParams);
  for (const param of AUTOUR_PARAMS) remaining.delete(param);
  return remaining;
};

export const autourHref = ({ lat, lng, adresse, commune }: Autour, searchParams: URLSearchParams): string => {
  const params = withoutAutourParams(searchParams);
  params.delete('page');
  params.set('lat', String(lat));
  params.set('lng', String(lng));
  if (adresse != null) params.set('adresse', adresse);
  if (commune != null) params.set('commune', commune);
  return `${AUTOUR_PATH}?${params}`;
};

const URL_PARTS = /^([^?#]*)(?:\?([^#]*))?(#.*)?$/;

export const withoutAutourParamsInUrl = (url: string): string => {
  const [, path = '', query, hash = ''] = url.match(URL_PARTS) ?? [];
  const searchParams = new URLSearchParams(query);
  if (!AUTOUR_PARAMS.some((param) => searchParams.has(param))) return url;
  const remaining = withoutAutourParams(searchParams).toString();
  return `${path}${remaining ? `?${remaining}` : ''}${hash}`;
};
