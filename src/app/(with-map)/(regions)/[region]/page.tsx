import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DepartementsPage } from '@/features/cartographie';
import { withRegion } from '@/features/collectivites-territoriales';
import { asCount, buildAndFilter, countFromHeaders, filterUnion } from '@/libraries/api/options';
import { departements, matchingDepartementsFrom, type Region, regionMatchingSlug, regions } from '@/libraries/collectivites';
import {
  applyFilters,
  codeInseeStartWithFilterTemplate,
  filtersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';
import { page, withSearchParams } from '@/libraries/nextjs/page';
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

export default page.withAll(withRegion(), withSearchParams<{ page: string }>()).render(async ({ region, searchParams }) => {
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
});
