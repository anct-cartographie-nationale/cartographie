import type { BBox } from 'geojson';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';
import { mapChunk } from '@/features/cartographie/map-chunk';
import { MAP_CHUNK_OPTIONS } from '@/features/cartographie/map-chunk-options';

const querySchema = z.object({
  latitude: z.transform(Number).refine((latitude: number) => !Number.isNaN(latitude), {
    message: 'le paramètre latitude est requis et dois être un nombre, ex : ?latitude=42.1337'
  }),
  longitude: z.transform(Number).refine((longitude: number) => !Number.isNaN(longitude), {
    message: 'le paramètre longitude est requis et dois être un nombre, ex : ?longitude=0.07'
  })
});

const fetchLieuxForChunk = async (longitude: number, latitude: number) => {
  const [minLon, minLat, maxLon, maxLat]: BBox = mapChunk([longitude, latitude], MAP_CHUNK_OPTIONS);

  return inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    select: ['id', 'latitude', 'longitude'],
    filter: { latitude: [`gt.${minLat}`, `lte.${maxLat}`], longitude: [`gt.${minLon}`, `lte.${maxLon}`] }
  });
};

const getCachedLieux = (longitude: number, latitude: number) =>
  unstable_cache(async () => fetchLieuxForChunk(longitude, latitude), [`lieux-chunk-${latitude}-${longitude}`], {
    revalidate: 43200,
    tags: ['lieux-chunks']
  })();

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: z.treeifyError(parsed.error).properties }, { status: 422 });

  return Response.json(await getCachedLieux(parsed.data.longitude, parsed.data.latitude));
};
