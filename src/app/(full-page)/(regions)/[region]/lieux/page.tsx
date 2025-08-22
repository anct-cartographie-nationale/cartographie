import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { appPageTitle } from '@/libraries/utils';

export const generateMetadata = async ({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) return notFound();

  return {
    title: appPageTitle('Liste des lieux', region.nom),
    description: `Consultez la liste de tous les lieux d'inclusion numérique de la région ${region.nom}.`
  };
};

export const generateStaticParams = () => regions.map(({ slug }: Region) => ({ region: slug }));

const Page = async ({ params }: { params: Promise<{ region: string }> }) => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) return notFound();

  return <LieuxPage breadcrumbsItems={[{ label: 'France', href: '/' }, { label: region.nom }]} mapHref={`/${region.slug}`} />;
};

export default Page;
