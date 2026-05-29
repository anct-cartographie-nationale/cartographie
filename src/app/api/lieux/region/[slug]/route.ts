import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { withRegion } from '@/features/collectivites-territoriales/middlewares/route';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema, paginationSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';

const PAGE_SIZE = 24;

export const GET = routeBuilder()
  .use(
    withRegion('slug'),
    withSearchParams((raw) => paginationSchema(PAGE_SIZE).extend(filtersSchema.shape).parse(raw))
  )
  .use(
    withFetch(
      'lieuxData',
      ({ region, searchParams: { page, limit, ...filters } }) => fetchLieux(region)(filters, { page, limit }),
      {
        cache: {
          cacheKey: ({ region, searchParams }) => ['lieux', 'region', region.code, searchParams],
          revalidate: false,
          tags: ['lieux']
        }
      }
    )
  )
  .handle(async ({ lieuxData: { lieux, total } }) =>
    Response.json({ lieux: lieux.map((lieu) => toLieuListItem()(appendCollectivites(lieu))), totalLieux: total })
  );
