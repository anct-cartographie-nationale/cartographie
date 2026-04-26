import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DepartementsPage } from '@/features/cartographie';
import { withRegion } from '@/features/collectivites-territoriales/middlewares/page';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import {
  filterDepartementsByTerritoire,
  matchingDepartementsFrom,
  type Region,
  regionMatchingSlug,
  regions
} from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { pageBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/page';
import { appPageTitle } from '@/libraries/utils';

type PageProps = {
  searchParams?: Promise<{ page: string }>;
  params: Promise<{ region: string }>;
};

export const generateStaticParams = () => regions.map(({ slug }: Region) => ({ region: slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const region: Region | undefined = regions.find(regionMatchingSlug((await params).region));
  return region
    ? {
        title: appPageTitle(region.nom),
        description: `Consultez les lieux d'inclusion numérique de la région ${region.nom}.`
      }
    : notFound();
};

export default pageBuilder()
  .use(withRegion(), withSearchParams(filtersSchema))
  .use(
    withFetch('totalLieux', ({ region, searchParams }) => countLieux(region)(searchParams), {
      cache: {
        cacheKey: ({ region, searchParams }) => ['totalLieux', region.code, searchParams],
        revalidate: false,
        tags: ['lieux']
      }
    }),
    withFetch('departements', ({ region, searchParams }) =>
      Promise.resolve(filterDepartementsByTerritoire(searchParams).filter(matchingDepartementsFrom(region)))
    )
  )
  .render(async ({ region, totalLieux, departements }) => (
    <DepartementsPage totalLieux={totalLieux} region={region} departements={departements} />
  ));
