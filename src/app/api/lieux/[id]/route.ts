import { routeBuilder, withFetch, withMap, withRequired } from '@arckit/nextjs/route';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieuDetails } from '@/features/lieux-inclusion-numerique/abilities/detail-view/query';
import { toLieuDetails } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-details';

export const GET = routeBuilder()
  .use(withMap('id', ({ params }) => params['id']))
  .use(withRequired('id'))
  .use(
    withFetch('lieu', ({ id }) => fetchLieuDetails(id), {
      cache: { cacheKey: ({ id }) => ['lieu', id], revalidate: false, tags: ['lieux'] }
    })
  )
  .use(withRequired('lieu'))
  .handle(async ({ lieu }) => Response.json(toLieuDetails(appendCollectivites(lieu))));
