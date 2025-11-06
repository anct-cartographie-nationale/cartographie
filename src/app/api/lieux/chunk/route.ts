import type { BBox } from 'geojson';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';
import { MAP_CHUNK_OPTIONS, mapChunk } from '@/features/cartographie/geo';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { type FiltersSchema, filtersSchema } from '@/features/lieux-inclusion-numerique/validations';

type Localisation = { longitude: number; latitude: number };

const locationSchema = z.object({
  latitude: z.transform(Number).refine((latitude: number) => !Number.isNaN(latitude), {
    message: 'le paramètre latitude est requis et dois être un nombre, ex : ?latitude=42.1337'
  }),
  longitude: z.transform(Number).refine((longitude: number) => !Number.isNaN(longitude), {
    message: 'le paramètre longitude est requis et dois être un nombre, ex : ?longitude=0.07'
  })
});

const fetchLieuxForChunk = ({ longitude, latitude }: Localisation, filters: FiltersSchema) => {
  const [minLon, minLat, maxLon, maxLat]: BBox = mapChunk([longitude, latitude], MAP_CHUNK_OPTIONS);

  return inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    select: ['id', 'nom', 'latitude', 'longitude'],
    filter: {
      latitude: [`gt.${minLat}`, `lte.${maxLat}`],
      longitude: [`gt.${minLon}`, `lte.${maxLon}`],
      ...applyFilters(filters)
    }
  });
};

const getCachedLieux = ({ longitude, latitude }: Localisation, filters: FiltersSchema) =>
  unstable_cache(
    () =>
      fetchLieuxForChunk(
        {
          longitude,
          latitude
        },
        filters
      ),
    [`${latitude}-${longitude}`, JSON.stringify(filters)],
    {
      revalidate: 43200,
      tags: ['lieux-chunks']
    }
  )();

export const GET = async (request: Request) => {
  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());

  const parsed = locationSchema.safeParse(searchParams);
  if (!parsed.success) return NextResponse.json({ error: z.treeifyError(parsed.error).properties }, { status: 422 });

  const [lieux] = await getCachedLieux(parsed.data, filtersSchema.parse(searchParams));
  return Response.json(lieux);
};
