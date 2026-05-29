import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';

export const GET = routeBuilder()
  .use(withSearchParams((raw) => filtersSchema.parse(raw)))
  .use(
    withFetch('totalLieux', ({ searchParams }) => countLieux()(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['total', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(async ({ totalLieux }) => Response.json({ totalLieux }));
