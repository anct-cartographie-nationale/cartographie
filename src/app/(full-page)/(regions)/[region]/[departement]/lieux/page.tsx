import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEPARTEMENTS_ROUTE, inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/api/inclusion-numerique';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import {
  type Departement,
  departementMatchingCode,
  departementMatchingSlug
} from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingDepartement, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { appPageTitle } from '@/libraries/utils';

export const generateMetadata = async ({ params }: { params: Promise<{ departement: string }> }): Promise<Metadata> => {
  const slug: string = (await params).departement;
  const departement: Departement | undefined = departements.find(departementMatchingSlug(slug));

  if (!departement) return notFound();

  return {
    title: appPageTitle('Liste des lieux', departement.nom),
    description: `Consultez la liste de tous les lieux d'inclusion numérique du département ${departement.nom}.`
  };
};

export const generateStaticParams = () =>
  departements.map((departement: Departement) => {
    const region: Region | undefined = regions.find(regionMatchingDepartement(departement));
    if (!region) return null;

    return {
      region: region.slug,
      departement: departement.slug
    };
  });

const Page = async ({ params }: { params: Promise<{ region: string; departement: string }> }) => {
  const regionSlug: string = (await params).region;
  const departementSlug: string = (await params).departement;

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  if (!region || !departement) return notFound();

  const lieux = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 24, offset: 0 },
    select: [
      'id',
      'nom',
      'adresse',
      'code_postal',
      'code_insee',
      'commune',
      'latitude',
      'longitude',
      'prise_rdv',
      'horaires',
      'dispositif_programmes_nationaux'
    ],
    filter: {
      code_insee: `like.${departement.code}%`
    }
  });

  const departementRouteResponse = await inclusionNumeriqueFetchApi(DEPARTEMENTS_ROUTE);

  return (
    <LieuxPage
      totalLieux={departementRouteResponse.find(departementMatchingCode(departement.code))?.nombre_lieux ?? 0}
      lieux={lieux.map(appendCollectivites)}
      breadcrumbsItems={[
        { label: 'France', href: '/' },
        { label: region.nom, href: `/${region.slug}` },
        { label: departement.nom }
      ]}
      mapHref={`/${region.slug}/${departement.slug}`}
    />
  );
};

export default Page;
