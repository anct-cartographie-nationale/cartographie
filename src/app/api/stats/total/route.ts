import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = routeBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('totalLieux', ({ searchParams }) => countLieux()(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['total', searchParams], revalidate: SIX_HOURS }
    })
  )
  .handle(async ({ totalLieux }) => Response.json({ totalLieux }));
