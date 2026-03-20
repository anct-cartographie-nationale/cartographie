import { pipe } from 'effect';
import { fetchDepartementsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(filtersSchema)),
  (r) => use(r)(withFetch('departementsStats', ({ searchParams }) => fetchDepartementsStats(searchParams))),
  (r) => handle(r)(async ({ departementsStats }) => Response.json(departementsStats))
);
