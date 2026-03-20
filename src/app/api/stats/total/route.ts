import { pipe } from 'effect';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(filtersSchema)),
  (r) => use(r)(withFetch('totalLieux', ({ searchParams }) => countLieux(searchParams))),
  (r) => handle(r)(async ({ totalLieux }) => Response.json({ totalLieux }))
);
