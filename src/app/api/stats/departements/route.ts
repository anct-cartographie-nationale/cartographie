import { fetchDepartementsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = routeBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('departementsStats', ({ searchParams }) => fetchDepartementsStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['departements', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(async ({ departementsStats }) => Response.json(departementsStats));
