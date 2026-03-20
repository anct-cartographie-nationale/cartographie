import { pipe } from 'effect';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { fetchLieuDetails } from '@/features/lieux-inclusion-numerique/abilities/detail-view/query';
import { toLieuDetails } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-details';
import { fromRoute, handle, use, withFetch, withPathParams, withRequired } from '@/libraries/nextjs/route';

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withPathParams('id')),
  (r) => use(r)(withRequired('id')),
  (r) => use(r)(withFetch('lieu', ({ id }) => fetchLieuDetails(id))),
  (r) => use(r)(withRequired('lieu')),
  (r) => handle(r)(async ({ lieu }) => Response.json(toLieuDetails(appendCollectivites(lieu))))
);
