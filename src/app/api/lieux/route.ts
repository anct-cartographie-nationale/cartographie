import { appendCollectivites } from '@/features/collectivites-territoriales';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema, paginationSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const PAGE_SIZE = 24;

export const GET = routeBuilder()
  .use(withSearchParams(paginationSchema(PAGE_SIZE).extend(filtersSchema.shape)))
  .use(
    withFetch('lieux', ({ searchParams: { page, limit, ...filters } }) => fetchLieux()(filters, { page, limit })),
    withFetch('totalLieux', ({ searchParams: { page, limit, ...filters } }) => countLieux()(filters))
  )
  .handle(async ({ lieux, totalLieux }) =>
    Response.json({ lieux: lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu))), totalLieux })
  );
