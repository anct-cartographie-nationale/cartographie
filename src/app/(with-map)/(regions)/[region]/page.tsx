import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEPARTEMENTS_ROUTE, inclusionNumeriqueFetchApi } from '@/external-api/inclusion-numerique';
import { totalLieux } from '@/external-api/inclusion-numerique/transfer/total-lieux';
import { DepartementsPage } from '@/features/cartographie/departements.page';
import departements from '@/features/collectivites-territoriales/departements.json';
import { matchingDepartementsFrom, type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { appPageTitle } from '@/libraries/utils';

export const generateMetadata = async ({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) return notFound();

  return {
    title: appPageTitle(region.nom),
    description: `Consultez les lieux d'inclusion numérique de la région ${region.nom}.`
  };
};

export const generateStaticParams = () => regions.map(({ slug }: Region) => ({ region: slug }));

const Page = async ({ params }: { params: Promise<{ region: string }> }) => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) return notFound();

  const departementRouteResponse = await inclusionNumeriqueFetchApi(DEPARTEMENTS_ROUTE);

  return (
    <DepartementsPage
      totalLieux={totalLieux(departementRouteResponse.filter(matchingDepartementsFrom(region)))}
      region={region}
      departements={departements.filter(matchingDepartementsFrom(region))}
    />
  );
};

export default Page;
