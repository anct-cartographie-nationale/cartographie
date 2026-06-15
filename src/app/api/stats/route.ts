import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { withLogger } from '@/configuration/telemetry/logger/server';
import { fetchAllStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';

export const GET = routeBuilder()
  .use(withSearchParams((raw) => filtersSchema.parse(raw)))
  .use(
    withFetch('stats', ({ searchParams }) => fetchAllStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['stats', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(withLogger('api:stats')(async ({ stats }) => Response.json(stats)));
