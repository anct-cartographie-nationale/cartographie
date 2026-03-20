import { pipe } from 'effect';
import { countLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-region';
import { regionMatchingSlug, regions } from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import {
  fromRoute,
  handle,
  use,
  withDerive,
  withFetch,
  withPathParams,
  withRequired,
  withSearchParams
} from '@/libraries/nextjs/route';

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withPathParams('slug'), withSearchParams(filtersSchema)),
  (r) => use(r)(withDerive('region', ({ slug }) => regions.find(regionMatchingSlug(slug)))),
  (r) => use(r)(withRequired('region')),
  (r) => use(r)(withFetch('totalLieux', ({ region, searchParams }) => countLieuxForRegion(region)(searchParams))),
  (r) => handle(r)(async ({ totalLieux }) => Response.json({ totalLieux }))
);
