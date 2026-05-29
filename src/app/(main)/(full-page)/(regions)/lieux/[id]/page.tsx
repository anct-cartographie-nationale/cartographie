import { withFetch, withMap } from '@arckit/nextjs/page';
import { withParams, withRequired } from '@arckit/nextjs/page/middlewares';
import { pageBuilder, withUrlSearchParams } from '@/configuration/nextjs';
import { fetchLieuById } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieu-by-id';
import {
  departementMatchingCode,
  departements,
  getDepartementCodeFromInsee,
  regionMatchingDepartement,
  regions
} from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';

export default pageBuilder()
  .use(withParams('id'), withUrlSearchParams())
  .use(
    withFetch('lieu', ({ id }) => fetchLieuById(id), {
      cache: { cacheKey: ({ id }) => ['lieu-redirect', id], revalidate: false, tags: ['lieux'] }
    })
  )
  .use(withRequired('lieu'))
  .use(withMap('code', ({ lieu }) => getDepartementCodeFromInsee(lieu.adresse.code_insee)))
  .use(
    withMap('departement', ({ code }) => departements.find(departementMatchingCode(code))),
    withMap('region', ({ code }) => regions.find(regionMatchingDepartement({ code })))
  )
  .use(withRequired('departement', 'region'))
  .redirectTo(({ id, departement, region, urlSearchParams }) =>
    hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/${id}`)(urlSearchParams)
  );
