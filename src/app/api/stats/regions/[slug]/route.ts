import { pipe } from 'effect';
import { withRegion } from '@/features/collectivites-territoriales/middlewares/route';
import { countLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-region';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withRegion('slug'), withSearchParams(filtersSchema)),
  (r) => use(r)(withFetch('totalLieux', ({ region, searchParams }) => countLieuxForRegion(region)(searchParams))),
  (r) => handle(r)(async ({ totalLieux }) => Response.json({ totalLieux }))
);
