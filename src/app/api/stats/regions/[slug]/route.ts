import { pipe } from 'effect';
import { withRegion } from '@/features/collectivites-territoriales/middlewares/route';
import { countLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-region';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withRegion('slug'), withSearchParams(filtersSchema)),
  (r) =>
    use(r)(
      withFetch('totalLieux', ({ region, searchParams }) => countLieuxForRegion(region)(searchParams), {
        cache: { cacheKey: ({ region, searchParams }) => ['region', region.code, searchParams], revalidate: SIX_HOURS }
      })
    ),
  (r) => handle(r)(async ({ totalLieux }) => Response.json({ totalLieux }))
);
