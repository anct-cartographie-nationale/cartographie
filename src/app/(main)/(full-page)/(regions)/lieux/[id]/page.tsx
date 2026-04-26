import { fetchLieuById } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieu-by-id';
import {
  departementMatchingCode,
  departements,
  getDepartementCodeFromInsee,
  regionMatchingDepartement,
  regions
} from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { pageBuilder, withDerive, withFetch, withParams, withRequired, withUrlSearchParams } from '@/libraries/nextjs/page';

export default pageBuilder()
  .use(withParams('id'), withUrlSearchParams())
  .use(
    withFetch('lieu', ({ id }) => fetchLieuById(id), {
      cache: { cacheKey: ({ id }) => ['lieu-redirect', id], revalidate: false, tags: ['lieux'] }
    })
  )
  .use(withRequired('lieu'))
  .use(withDerive('code', ({ lieu }) => getDepartementCodeFromInsee(lieu.adresse.code_insee)))
  .use(
    withDerive('departement', ({ code }) => departements.find(departementMatchingCode(code))),
    withDerive('region', ({ code }) => regions.find(regionMatchingDepartement({ code })))
  )
  .use(withRequired('departement', 'region'))
  .redirectTo(({ id, departement, region, urlSearchParams }) =>
    hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/${id}`)(urlSearchParams)
  );
