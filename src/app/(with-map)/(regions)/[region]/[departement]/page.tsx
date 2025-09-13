import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEPARTEMENTS_ROUTE, inclusionNumeriqueFetchApi, LIEU_LIST_FIELDS, LIEUX_ROUTE } from '@/api/inclusion-numerique';
import { toLieuListItem } from '@/api/inclusion-numerique/transfer/toLieuListItem';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import {
  type Departement,
  departementMatchingCode,
  departementMatchingSlug
} from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingDepartement, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { DepartementLieuxPage } from '@/features/lieux-inclusion-numerique/departement-lieux.page';
import { appPageTitle } from '@/libraries/utils';
import { pageSchema } from '@/libraries/utils/page.schema';

export const generateMetadata = async ({ params }: { params: Promise<{ departement: string }> }): Promise<Metadata> => {
  const slug: string = (await params).departement;
  const departement: Departement | undefined = departements.find(departementMatchingSlug(slug));

  if (!departement) return notFound();

  return {
    title: appPageTitle(departement.nom),
    description: `Consultez les lieux d'inclusion numérique du département ${departement.nom}.`
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

type PageProps = {
  params: Promise<{ region: string; departement: string }>;
  searchParams?: Promise<{ page: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const regionSlug: string = (await params).region;
  const departementSlug: string = (await params).departement;
  const curentPage = pageSchema.parse((await searchParams)?.page);
  const limit = 10;

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  if (!region || !departement) return notFound();

  const lieux = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit, offset: (curentPage - 1) * limit },
    select: LIEU_LIST_FIELDS,
    filter: { code_insee: `like.${departement.code}%` },
    order: ['nom', 'asc']
  });

  const departementRouteResponse = await inclusionNumeriqueFetchApi(DEPARTEMENTS_ROUTE);

  return (
    <DepartementLieuxPage
      totalLieux={departementRouteResponse.find(departementMatchingCode(departement.code))?.nombre_lieux ?? 0}
      pageSize={limit}
      curentPage={curentPage}
      lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
      region={region}
      departement={departement}
    />
  );
};

export default Page;
