import { notFound, redirect } from 'next/navigation';
import {
  departementMatchingCode,
  departements,
  getDepartementCodeFromInsee,
  regionMatchingDepartement,
  regions
} from '@/libraries/collectivites';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/libraries/inclusion-numerique-api';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { page, withParams, withUrlSearchParams } from '@/libraries/nextjs/page';

export default page.withAll(withParams('id'), withUrlSearchParams()).render(async ({ id, urlSearchParams }) => {
  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 1, offset: 0 },
    filter: { id: `eq.${decodeURIComponent(id)}` },
    select: ['adresse']
  });

  const lieu = lieux[0];
  if (!lieu) return notFound();

  const code = getDepartementCodeFromInsee(lieu.adresse.code_insee);

  const departement = departements.find(departementMatchingCode(code));
  const region = regions.find(regionMatchingDepartement({ code }));

  if (!region || !departement) return notFound();

  redirect(hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/${id}`)(urlSearchParams));
});
