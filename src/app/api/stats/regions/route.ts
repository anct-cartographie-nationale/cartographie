import { pipe } from 'effect';
import { fetchRegionsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(filtersSchema)),
  (r) => use(r)(withFetch('regionsStats', ({ searchParams }) => fetchRegionsStats(searchParams))),
  (r) => handle(r)(async ({ regionsStats }) => Response.json(regionsStats))
);
