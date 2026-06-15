import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { withLogger } from '@/configuration/telemetry/logger/server';
import { fetchRegionsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';

export const GET = routeBuilder()
  .use(withSearchParams((raw) => filtersSchema.parse(raw)))
  .use(
    withFetch('regionsStats', ({ searchParams }) => fetchRegionsStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['regions', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(withLogger('api:stats:regions')(async ({ regionsStats }) => Response.json(regionsStats)));
