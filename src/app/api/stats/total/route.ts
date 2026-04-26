import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = routeBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('totalLieux', ({ searchParams }) => countLieux()(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['total', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(async ({ totalLieux }) => Response.json({ totalLieux }));
