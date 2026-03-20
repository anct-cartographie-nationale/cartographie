import { pipe } from 'effect';
import { z } from 'zod';
import { fetchLieuxForChunkServer } from '@/features/lieux-inclusion-numerique/abilities/map-view/query/fetch-lieux-for-chunk.server';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const locationSchema = z.object({
  latitude: z.transform(Number).refine((latitude: number) => !Number.isNaN(latitude), {
    message: 'le paramètre latitude est requis et dois être un nombre, ex : ?latitude=42.1337'
  }),
  longitude: z.transform(Number).refine((longitude: number) => !Number.isNaN(longitude), {
    message: 'le paramètre longitude est requis et dois être un nombre, ex : ?longitude=0.07'
  })
});

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(locationSchema.extend(filtersSchema.shape))),
  (r) =>
    use(r)(
      withFetch('lieux', ({ searchParams: { latitude, longitude, ...filters } }) =>
        fetchLieuxForChunkServer([longitude, latitude], filters)
      )
    ),
  (r) => handle(r)(async ({ lieux }) => Response.json(lieux))
);
