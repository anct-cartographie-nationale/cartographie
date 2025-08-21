import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DepartementPage } from '@/features/cartographie/departement.page';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingDepartement, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { appPageTitle } from '@/libraries/utils';

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

const Page = async ({ params }: { params: Promise<{ region: string; departement: string }> }) => {
  const regionSlug: string = (await params).region;
  const departementSlug: string = (await params).departement;

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  if (!region || !departement) return notFound();

  return <DepartementPage region={region} departement={departement} />;
};

export default Page;
