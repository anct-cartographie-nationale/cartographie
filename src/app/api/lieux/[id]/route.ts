import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieuDetails } from '@/features/lieux-inclusion-numerique/abilities/detail-view/query';
import { toLieuDetails } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-details';
import { routeBuilder, withFetch, withPathParams, withRequired } from '@/libraries/nextjs/route';

export const GET = routeBuilder()
  .use(withPathParams('id'))
  .use(withRequired('id'))
  .use(withFetch('lieu', ({ id }) => fetchLieuDetails(id)))
  .use(withRequired('lieu'))
  .handle(async ({ lieu }) => Response.json(toLieuDetails(appendCollectivites(lieu))));
