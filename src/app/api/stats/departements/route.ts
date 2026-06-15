import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { withLogger } from '@/configuration/telemetry/logger/server';
import { fetchDepartementsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';

export const GET = routeBuilder()
  .use(withSearchParams((raw) => filtersSchema.parse(raw)))
  .use(
    withFetch('departementsStats', ({ searchParams }) => fetchDepartementsStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['departements', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(withLogger('api:stats:departements')(async ({ departementsStats }) => Response.json(departementsStats)));
