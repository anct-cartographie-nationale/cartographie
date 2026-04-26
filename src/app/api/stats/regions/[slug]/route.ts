import { withRegion } from '@/features/collectivites-territoriales/middlewares/route';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = routeBuilder()
  .use(withRegion('slug'), withSearchParams(filtersSchema))
  .use(
    withFetch('totalLieux', ({ region, searchParams }) => countLieux(region)(searchParams), {
      cache: {
        cacheKey: ({ region, searchParams }) => ['region', region.code, searchParams],
        revalidate: false,
        tags: ['lieux']
      }
    })
  )
  .handle(async ({ totalLieux }) => Response.json({ totalLieux }));
