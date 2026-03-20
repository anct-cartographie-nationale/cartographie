import { pipe } from 'effect';
import { z } from 'zod';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().catch(24)
});

const querySchema = paginationSchema.extend(filtersSchema.shape);

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(querySchema)),
  (r) =>
    use(r)(
      withFetch('lieux', ({ searchParams: { page, limit, ...filters } }) => fetchLieux(filters, { page, limit })),
      withFetch('totalLieux', ({ searchParams: { page, limit, ...filters } }) => countLieux(filters))
    ),
  (r) =>
    handle(r)(async ({ lieux, totalLieux }) =>
      Response.json({ lieux: lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu))), totalLieux })
    )
);
