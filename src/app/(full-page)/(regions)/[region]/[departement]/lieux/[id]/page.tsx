import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/api/inclusion-numerique';
import { toLieuDetails } from '@/api/inclusion-numerique/transfer/toLieuDetails';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { FicheLieuPage } from '@/features/lieux-inclusion-numerique/fiche-lieu.page';
import { appPageTitle } from '@/libraries/utils';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
  const id: string = (await params).id;

  const lieux = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 1, offset: 0 },
    filter: { id: `eq.${decodeURIComponent(id)}` }
  });

  return {
    title: appPageTitle('Fiche du lieu', lieux[0]?.nom ?? id),
    description: `Consultez la fiche du lieu de médiation numérique ${lieux[0]?.nom ?? id}.`
  };
};

type PageProps = {
  params: Promise<{ region: string; departement: string; id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const regionSlug: string = (await params).region;
  const departementSlug: string = (await params).departement;
  const id: string = (await params).id;

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  const lieux = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 1, offset: 0 },
    filter: { id: `eq.${decodeURIComponent(id)}` }
  });

  const lieu = lieux[0];

  if (!region || !departement || !lieu) return notFound();

  return (
    <FicheLieuPage
      lieu={toLieuDetails(appendCollectivites(lieu))}
      breadcrumbsItems={[
        { label: 'France', href: '/' },
        { label: region.nom, href: `/${region.slug}` },
        { label: departement.nom, href: `/${region.slug}/${departement.slug}` },
        { label: `${lieu.code_postal} ${lieu.commune}` }
      ]}
      listHref={`/${region.slug}/${departement.slug}`}
    />
  );
};

export default Page;
