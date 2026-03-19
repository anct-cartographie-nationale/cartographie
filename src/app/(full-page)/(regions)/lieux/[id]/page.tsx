import { pipe } from 'effect';
import { fetchLieuById } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieu-by-id';
import {
  departementMatchingCode,
  departements,
  getDepartementCodeFromInsee,
  regionMatchingDepartement,
  regions
} from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import {
  fromPage,
  redirectTo,
  use,
  withDerive,
  withFetch,
  withParams,
  withRequired,
  withUrlSearchParams
} from '@/libraries/nextjs/page';

export default pipe(
  fromPage,
  (p) => use(p)(withParams('id'), withUrlSearchParams()),
  (p) => use(p)(withFetch('lieu', ({ id }) => fetchLieuById(id))),
  (p) => use(p)(withRequired('lieu')),
  (p) => use(p)(withDerive('code', ({ lieu }) => getDepartementCodeFromInsee(lieu.adresse.code_insee))),
  (p) =>
    use(p)(
      withDerive('departement', ({ code }) => departements.find(departementMatchingCode(code))),
      withDerive('region', ({ code }) => regions.find(regionMatchingDepartement({ code })))
    ),
  (p) => use(p)(withRequired('departement', 'region')),
  (p) =>
    redirectTo(p)(({ id, departement, region, urlSearchParams }) =>
      hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/${id}`)(urlSearchParams)
    )
);
