import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RegionPage } from '@/features/cartographie/region.page';
import departements from '@/features/collectivites-territoriales/departements.json';
import regions from '@/features/collectivites-territoriales/regions.json';
import { appPageTitle } from '@/libraries/utils';

export const generateMetadata = async ({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> => {
  const slug = (await params).region;
  const region = regions.find((r) => r.slug === slug);

  if (!region) return notFound();

  return {
    title: appPageTitle(region.nom),
    description: `Consultez les lieux d'inclusion numérique de la région ${region.nom}.`
  };
};

export const generateStaticParams = () => regions.map(({ slug }) => ({ region: slug }));

const Page = async ({ params }: { params: Promise<{ region: string }> }) => {
  const slug = (await params).region;
  const region = regions.find((r) => r.slug === slug);

  if (!region) return notFound();

  const regionDepartements = departements.filter(({ code }) => region.departements.includes(code));

  return <RegionPage region={region} departements={regionDepartements} />;
};

export default Page;
