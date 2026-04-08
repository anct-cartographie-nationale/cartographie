import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { departementMatchingCode, departements } from '@/libraries/collectivites';
import { filtersSchema, paginationSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { routeBuilder, withDerive, withFetch, withPathParams, withRequired, withSearchParams } from '@/libraries/nextjs/route';

const PAGE_SIZE = 10;

export const GET = routeBuilder()
  .use(withPathParams('code'), withSearchParams(paginationSchema(PAGE_SIZE).extend(filtersSchema.shape)))
  .use(withDerive('departement', ({ code }) => departements.find(departementMatchingCode(code))))
  .use(withRequired('departement'))
  .use(
    withFetch('lieuxData', ({ departement, searchParams: { page, limit, ...filters } }) =>
      fetchLieux(departement)(filters, { page, limit })
    )
  )
  .handle(async ({ lieuxData: { lieux, total } }) =>
    Response.json({ lieux: lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu))), totalLieux: total })
  );
