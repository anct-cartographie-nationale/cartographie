import { routeBuilder, withFetch, withMap, withParams, withRequired, withSearchParams } from '@arckit/nextjs/route';
import { withLogger } from '@/configuration/telemetry/logger/server';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { departementMatchingCode, departements } from '@/libraries/collectivites';
import { filtersSchema, paginationSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';

const PAGE_SIZE = 10;

export const GET = routeBuilder()
  .use(withSearchParams((raw) => paginationSchema(PAGE_SIZE).extend(filtersSchema.shape).parse(raw)))
  .use(withParams('code'))
  .use(withMap('departement', ({ code }) => departements.find(departementMatchingCode(code))))
  .use(withRequired('departement'))
  .use(
    withFetch(
      'lieuxData',
      ({ departement, searchParams: { page, limit, ...filters } }) => fetchLieux(departement)(filters, { page, limit }),
      {
        cache: {
          cacheKey: ({ departement, searchParams }) => ['lieux', 'departement', departement.code, searchParams],
          revalidate: false,
          tags: ['lieux']
        }
      }
    )
  )
  .handle(
    withLogger('api:lieux:departement')(async ({ lieuxData: { items, totalItems } }) =>
      Response.json({ lieux: items.map((lieu) => toLieuListItem()(appendCollectivites(lieu))), totalLieux: totalItems })
    )
  );
