import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  codeInseeStartWithFilterTemplate,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { DepartementsPage } from '@/features/cartographie/departements.page';
import departements from '@/features/collectivites-territoriales/departements.json';
import { matchingDepartementsFrom, type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, buildAndFilter, countFromHeaders, filterUnion } from '@/libraries/api/options';
import { appPageTitle } from '@/libraries/utils';

type PageProps = {
  searchParams?: Promise<{ page: string }>;
  params: Promise<{ region: string }>;
};

export const generateStaticParams = () => regions.map(({ slug }: Region) => ({ region: slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) return notFound();

  return {
    title: appPageTitle(region.nom),
    description: `Consultez les lieux d'inclusion numérique de la région ${region.nom}.`
  };
};

const Page = async ({ params, searchParams: searchParamsPromise }: PageProps) => {
  const searchParams = await searchParamsPromise;

  const region: Region | undefined = regions.find(regionMatchingSlug((await params).region));

  if (!region) return notFound();

  const filter = buildAndFilter(
    filterUnion(region.departements)(codeInseeStartWithFilterTemplate),
    applyFilters(filtersSchema.parse(searchParams))
  );

  const [, headers] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }));

  return (
    <DepartementsPage
      totalLieux={countFromHeaders(headers)}
      region={region}
      departements={departements.filter(matchingDepartementsFrom(region))}
    />
  );
};

export default Page;
