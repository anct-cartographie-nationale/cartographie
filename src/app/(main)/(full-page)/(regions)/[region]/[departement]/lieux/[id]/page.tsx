import type { Metadata } from 'next';
import { sendContactMessageAction } from '@/app/_actions/contact/send-contact-message.action';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { withDepartement, withRegion } from '@/features/collectivites-territoriales/middlewares/page';
import { ContactAction } from '@/features/contact';
import { SEND_CONTACT_MESSAGE_ACTION } from '@/features/contact/abilities/send-message/injection/send-contact-message-action.key';
import { FicheLieuPage } from '@/features/lieux-inclusion-numerique';
import { fetchLieuDetails } from '@/features/lieux-inclusion-numerique/abilities/detail-view/query/fetch-lieu-details';
import { toLieuDetails } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-details';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import {
  pageBuilder,
  withClientBinder,
  withFetch,
  withParams,
  withRequired,
  withUrlSearchParams
} from '@/libraries/nextjs/page';
import { appPageTitle } from '@/libraries/utils';
import { CONTACT_ACTION } from '@/shared/injection/keys/contact-action.key';

type PageProps = {
  params: Promise<{ region: string; departement: string; id: string }>;
  searchParams?: Promise<{ page: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const lieu = await fetchLieuDetails((await params).id);

  return {
    title: appPageTitle('Fiche du lieu', lieu?.nom ?? 'Lieu introuvable'),
    description: `Consultez la fiche du lieu de médiation numérique ${lieu?.nom ?? ''}.`
  };
};

export default pageBuilder()
  .use(withClientBinder(CONTACT_ACTION, ContactAction), withClientBinder(SEND_CONTACT_MESSAGE_ACTION, sendContactMessageAction))
  .use(withRegion(), withDepartement(), withParams('id'), withUrlSearchParams())
  .use(
    withFetch('lieu', ({ id }) => fetchLieuDetails(id), {
      cache: { cacheKey: ({ id }) => ['lieu', id], revalidate: false, tags: ['lieux'] }
    })
  )
  .use(withRequired('lieu'))
  .render(async ({ region, departement, lieu, urlSearchParams }) => {
    const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'];
    const lieuPath = `/${region.slug}/${departement.slug}/lieux/${encodeURIComponent(lieu.id)}`;
    const lieuUrl = siteUrl ? `${siteUrl}${lieuPath}` : lieuPath;

    return (
      <FicheLieuPage
        lieu={toLieuDetails(appendCollectivites(lieu))}
        breadcrumbsItems={[
          { label: 'France', href: hrefWithSearchParams('/')(urlSearchParams, ['page']) },
          { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page']) },
          {
            label: departement.nom,
            href: hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(urlSearchParams, ['page'])
          },
          { label: `${lieu.adresse.code_postal} ${lieu.adresse.commune}` }
        ]}
        listHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(urlSearchParams, ['page'])}
        lieuUrl={lieuUrl}
      />
    );
  });
