import { pipe } from 'effect';
import { fetchRegionsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(filtersSchema)),
  (r) =>
    use(r)(
      withFetch('regionsStats', ({ searchParams }) => fetchRegionsStats(searchParams), {
        cache: { cacheKey: ({ searchParams }) => ['regions', searchParams], revalidate: SIX_HOURS }
      })
    ),
  (r) => handle(r)(async ({ regionsStats }) => Response.json(regionsStats))
);
