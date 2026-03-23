import { withRegion } from '@/features/collectivites-territoriales/middlewares/route';
import { countLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-region';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = routeBuilder()
  .use(withRegion('slug'), withSearchParams(filtersSchema))
  .use(
    withFetch('totalLieux', ({ region, searchParams }) => countLieuxForRegion(region)(searchParams), {
      cache: { cacheKey: ({ region, searchParams }) => ['region', region.code, searchParams], revalidate: SIX_HOURS }
    })
  )
  .handle(async ({ totalLieux }) => Response.json({ totalLieux }));
