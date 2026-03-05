import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appendCollectivites, withDepartement, withRegion } from '@/features/collectivites-territoriales';
import { FicheLieuPage } from '@/features/lieux-inclusion-numerique';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/libraries/inclusion-numerique-api';
import { toLieuDetails } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-details';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { page, withParams, withUrlSearchParams } from '@/libraries/nextjs/page';
import { appPageTitle } from '@/libraries/utils';

type PageProps = {
  params: Promise<{ region: string; departement: string; id: string }>;
  searchParams?: Promise<{ page: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const id: string = (await params).id;

  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 1, offset: 0 },
    filter: { id: `eq.${decodeURIComponent(id)}` }
  });

  return {
    title: appPageTitle('Fiche du lieu', lieux[0]?.nom ?? id),
    description: `Consultez la fiche du lieu de médiation numérique ${lieux[0]?.nom ?? id}.`
  };
};

export default page
  .withAll(withRegion(), withDepartement(), withParams('id'), withUrlSearchParams())
  .render(async ({ region, departement, id, urlSearchParams }) => {
    const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
      paginate: { limit: 1, offset: 0 },
      filter: { id: `eq.${decodeURIComponent(id)}` }
    });

    const lieu = lieux[0];

    if (!lieu) return notFound();

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
      />
    );
  });
