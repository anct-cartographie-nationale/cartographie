import { fetchAllStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = routeBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('stats', ({ searchParams }) => fetchAllStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['stats', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(async ({ stats }) => Response.json(stats));
