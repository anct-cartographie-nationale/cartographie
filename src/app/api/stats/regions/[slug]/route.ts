import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { withLogger } from '@/configuration/telemetry/logger/server';
import { withRegion } from '@/features/collectivites-territoriales/middlewares/route';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';

export const GET = routeBuilder()
  .use(
    withRegion('slug'),
    withSearchParams((raw) => filtersSchema.parse(raw))
  )
  .use(
    withFetch('totalLieux', ({ region, searchParams }) => countLieux(region)(searchParams), {
      cache: {
        cacheKey: ({ region, searchParams }) => ['region', region.code, searchParams],
        revalidate: false,
        tags: ['lieux']
      }
    })
  )
  .handle(withLogger('api:stats:regions:detail')(async ({ totalLieux }) => Response.json({ totalLieux })));
