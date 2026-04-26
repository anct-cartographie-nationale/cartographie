import { fetchRegionsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = routeBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('regionsStats', ({ searchParams }) => fetchRegionsStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['regions', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(async ({ regionsStats }) => Response.json(regionsStats));
