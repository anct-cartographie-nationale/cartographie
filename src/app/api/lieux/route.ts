import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema, paginationSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const PAGE_SIZE = 24;
const SIX_HOURS = 6 * 60 * 60;

export const GET = routeBuilder()
  .use(withSearchParams(paginationSchema(PAGE_SIZE).extend(filtersSchema.shape)))
  .use(
    withFetch('lieuxData', ({ searchParams: { page, limit, ...filters } }) => fetchLieux()(filters, { page, limit }), {
      cache: { cacheKey: ({ searchParams }) => ['lieux', searchParams], revalidate: SIX_HOURS }
    })
  )
  .handle(async ({ lieuxData: { lieux, total } }) =>
    Response.json({ lieux: lieux.map((lieu) => toLieuListItem()(appendCollectivites(lieu))), totalLieux: total })
  );
