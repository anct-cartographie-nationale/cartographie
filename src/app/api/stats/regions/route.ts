import { fetchRegionsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = routeBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('regionsStats', ({ searchParams }) => fetchRegionsStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['regions', searchParams], revalidate: SIX_HOURS }
    })
  )
  .handle(async ({ regionsStats }) => Response.json(regionsStats));
