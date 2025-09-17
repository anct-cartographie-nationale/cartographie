import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { inclusionNumeriqueFetchApi, LIEU_LIST_FIELDS, LIEUX_ROUTE, REGIONS_ROUTE } from '@/api/inclusion-numerique';
import { toLieuListItem } from '@/api/inclusion-numerique/transfer/toLieuListItem';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { matchingRegionCode, type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { appPageTitle } from '@/libraries/utils';
import { pageSchema } from '@/libraries/utils/page.schema';

export const generateMetadata = async ({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) return notFound();

  return {
    title: appPageTitle('Liste des lieux', region.nom),
    description: `Consultez la liste de tous les lieux d'inclusion numérique de la région ${region.nom}.`
  };
};

export const generateStaticParams = async () => regions.map(({ slug }: Region) => ({ region: slug }));

type PageProps = {
  params: Promise<{ region: string }>;
  searchParams?: Promise<{ page: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));
  const curentPage = pageSchema.parse((await searchParams)?.page);
  const limit = 24;

  if (!region) return notFound();

  const lieux = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit, offset: (curentPage - 1) * limit },
    select: [...LIEU_LIST_FIELDS, 'telephone'],
    filter: { or: `(${region.departements.map((code) => `code_insee.like.${code}%`).join(',')})` },
    order: ['nom', 'asc']
  });

  const regionRouteResponse = await inclusionNumeriqueFetchApi(REGIONS_ROUTE);

  return (
    <LieuxPage
      totalLieux={regionRouteResponse.find(matchingRegionCode(region))?.nombre_lieux ?? 0}
      pageSize={limit}
      curentPage={curentPage}
      lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
      breadcrumbsItems={[{ label: 'France', href: '/' }, { label: region.nom }]}
      href={`/${region.slug}`}
    />
  );
};

export default Page;
