import { pipe } from 'effect';
import { z } from 'zod';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { countLieuxForDepartement } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-departement';
import { fetchLieuxForDepartement } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux-for-departement';
import { departementMatchingCode, departements } from '@/libraries/collectivites';
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
  limit: z.coerce.number().int().positive().catch(10)
});

const querySchema = paginationSchema.extend(filtersSchema.shape);

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withPathParams('code'), withSearchParams(querySchema)),
  (r) => use(r)(withDerive('departement', ({ code }) => departements.find(departementMatchingCode(code)))),
  (r) => use(r)(withRequired('departement')),
  (r) =>
    use(r)(
      withFetch('lieux', ({ departement, searchParams: { page, limit, ...filters } }) =>
        fetchLieuxForDepartement(departement)(filters, { page, limit })
      ),
      withFetch('totalLieux', ({ departement, searchParams: { page, limit, ...filters } }) =>
        countLieuxForDepartement(departement)(filters)
      )
    ),
  (r) =>
    handle(r)(async ({ lieux, totalLieux }) =>
      Response.json({ lieux: lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu))), totalLieux })
    )
);
