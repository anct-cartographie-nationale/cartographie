import { fetchDepartementsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = routeBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('departementsStats', ({ searchParams }) => fetchDepartementsStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['departements', searchParams], revalidate: SIX_HOURS }
    })
  )
  .handle(async ({ departementsStats }) => Response.json(departementsStats));
