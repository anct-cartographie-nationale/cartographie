import { pipe } from 'effect';
import { fetchDepartementsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(filtersSchema)),
  (r) =>
    use(r)(
      withFetch('departementsStats', ({ searchParams }) => fetchDepartementsStats(searchParams), {
        cache: { cacheKey: ({ searchParams }) => ['departements', searchParams], revalidate: SIX_HOURS }
      })
    ),
  (r) => handle(r)(async ({ departementsStats }) => Response.json(departementsStats))
);
