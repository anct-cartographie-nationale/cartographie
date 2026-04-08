import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieuDetails } from '@/features/lieux-inclusion-numerique/abilities/detail-view/query';
import { toLieuDetails } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-details';
import { routeBuilder, withFetch, withPathParams, withRequired } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

export const GET = routeBuilder()
  .use(withPathParams('id'))
  .use(withRequired('id'))
  .use(
    withFetch('lieu', ({ id }) => fetchLieuDetails(id), {
      cache: { cacheKey: ({ id }) => ['lieu', id], revalidate: SIX_HOURS }
    })
  )
  .use(withRequired('lieu'))
  .handle(async ({ lieu }) => Response.json(toLieuDetails(appendCollectivites(lieu))));
