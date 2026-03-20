import { pipe } from 'effect';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(filtersSchema)),
  (r) =>
    use(r)(
      withFetch('totalLieux', ({ searchParams }) => countLieux(searchParams), {
        cache: { cacheKey: ({ searchParams }) => ['total', searchParams], revalidate: SIX_HOURS }
      })
    ),
  (r) => handle(r)(async ({ totalLieux }) => Response.json({ totalLieux }))
);
