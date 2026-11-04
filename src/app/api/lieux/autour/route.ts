import { routeBuilder, withFetch, withMap, withRequired, withSearchParams } from '@arckit/nextjs/route';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieuxAutour } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema, paginationSchema } from '@/libraries/inclusion-numerique-api';
import { autourLocalisation, autourSchema } from '@/libraries/inclusion-numerique-api/filters/autour';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';

const PAGE_SIZE = 10;

export const GET = routeBuilder()
  .use(withSearchParams())
  .use(withMap('autour', ({ searchParams }) => autourSchema.safeParse(searchParams).data))
  .use(withRequired('autour'))
  .use(withMap('query', ({ searchParams }) => paginationSchema(PAGE_SIZE).extend(filtersSchema.shape).parse(searchParams)))
  .use(
    withFetch('lieuxData', ({ autour: { lat, lng }, query: { page, limit, ...filters } }) =>
      fetchLieuxAutour({ latitude: lat, longitude: lng })(filters, { page, limit })
    )
  )
  .handle(async ({ autour, lieuxData: { items, totalItems } }) =>
    Response.json({
      lieux: items.map((lieu) => toLieuListItem(autourLocalisation(autour))(appendCollectivites(lieu))),
      totalLieux: totalItems
    })
  );
