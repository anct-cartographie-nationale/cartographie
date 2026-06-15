import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { withLogger } from '@/configuration/telemetry/logger/server';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema, paginationSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';

const PAGE_SIZE = 24;

export const GET = routeBuilder()
  .use(withSearchParams((raw) => paginationSchema(PAGE_SIZE).extend(filtersSchema.shape).parse(raw)))
  .use(
    withFetch('lieuxData', ({ searchParams: { page, limit, ...filters } }) => fetchLieux()(filters, { page, limit }), {
      cache: { cacheKey: ({ searchParams }) => ['lieux', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(
    withLogger('api:lieux')(async ({ lieuxData: { items, totalItems } }) =>
      Response.json({ lieux: items.map((lieu) => toLieuListItem()(appendCollectivites(lieu))), totalLieux: totalItems })
    )
  );
