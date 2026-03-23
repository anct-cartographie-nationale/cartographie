import { appendCollectivites } from '@/features/collectivites-territoriales';
import { countLieuxForDepartement } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-departement';
import { fetchLieuxForDepartement } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux-for-departement';
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
    withFetch('lieux', ({ departement, searchParams: { page, limit, ...filters } }) =>
      fetchLieuxForDepartement(departement)(filters, { page, limit })
    ),
    withFetch('totalLieux', ({ departement, searchParams: { page, limit, ...filters } }) =>
      countLieuxForDepartement(departement)(filters)
    )
  )
  .handle(async ({ lieux, totalLieux }) =>
    Response.json({ lieux: lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu))), totalLieux })
  );
