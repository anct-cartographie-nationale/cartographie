import { pipe } from 'effect';
import { z } from 'zod';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { countLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-region';
import { fetchLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux-for-region';
import { regionMatchingSlug, regions } from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
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

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().catch(24)
});

const querySchema = paginationSchema.extend(filtersSchema.shape);

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withPathParams('slug'), withSearchParams(querySchema)),
  (r) => use(r)(withDerive('region', ({ slug }) => regions.find(regionMatchingSlug(slug)))),
  (r) => use(r)(withRequired('region')),
  (r) =>
    use(r)(
      withFetch('lieux', ({ region, searchParams: { page, limit, ...filters } }) =>
        fetchLieuxForRegion(region)(filters, { page, limit })
      ),
      withFetch('totalLieux', ({ region, searchParams: { page, limit, ...filters } }) => countLieuxForRegion(region)(filters))
    ),
  (r) =>
    handle(r)(async ({ lieux, totalLieux }) =>
      Response.json({ lieux: lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu))), totalLieux })
    )
);
