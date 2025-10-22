import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';
import { toLieuDetails } from '@/external-api/inclusion-numerique/transfer/toLieuDetails';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { FicheLieuPage } from '@/features/lieux-inclusion-numerique/fiche-lieu.page';
import { hrefWithSearchParams } from '@/libraries/next';
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

const Page = async ({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) => {
  const params = await paramsPromise;
  const urlSearchParams = new URLSearchParams(await searchParamsPromise);

  const region: Region | undefined = regions.find(regionMatchingSlug(params.region));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(params.departement));

  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 1, offset: 0 },
    filter: { id: `eq.${decodeURIComponent(params.id)}` }
  });

  const lieu = lieux[0];

  if (!region || !departement || !lieu) return notFound();

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
        { label: `${lieu.code_postal} ${lieu.commune}` }
      ]}
      listHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(urlSearchParams, ['page'])}
    />
  );
};

export default Page;
