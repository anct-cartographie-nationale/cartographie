import { pipe } from 'effect';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appendCollectivites, withRegion } from '@/features/collectivites-territoriales';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { countLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-region';
import { fetchLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux-for-region';
import { type Region, regionMatchingSlug, regions } from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import {
  fromPage,
  render,
  use,
  withFetch,
  withPagination,
  withSearchParams,
  withUrlSearchParams
} from '@/libraries/nextjs/page';
import { appPageTitle, pageSchema } from '@/libraries/utils';

type PageProps = {
  params: Promise<{ region: string }>;
  searchParams?: Promise<{ page: string }>;
};

const PAGE_SIZE = 24;

export const generateStaticParams = async () => regions.map(({ slug }: Region) => ({ region: slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const region: Region | undefined = regions.find(regionMatchingSlug((await params).region));
  return region
    ? {
        title: appPageTitle('Liste des lieux', region.nom),
        description: `Consultez la liste de tous les lieux d'inclusion numérique de la région ${region.nom}.`
      }
    : notFound();
};

export default pipe(
  fromPage,
  (p) => use(p)(withRegion(), withSearchParams(filtersSchema), withUrlSearchParams()),
  (p) => use(p)(withPagination(pageSchema)),
  (p) =>
    use(p)(
      withFetch('totalLieux', ({ region, searchParams }) => countLieuxForRegion(region)(searchParams)),
      withFetch('lieux', ({ region, searchParams, page }) =>
        fetchLieuxForRegion(region)(searchParams, { page, limit: PAGE_SIZE })
      )
    ),
  (p) =>
    render(p)(async ({ region, totalLieux, lieux, page, urlSearchParams }) => (
      <LieuxPage
        totalLieux={totalLieux}
        pageSize={PAGE_SIZE}
        curentPage={page}
        lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
        breadcrumbsItems={[
          { label: 'France', href: hrefWithSearchParams('/')(urlSearchParams, ['page']) },
          { label: region.nom }
        ]}
        mapHref={hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page'])}
        exportHref={hrefWithSearchParams(`/${region.slug}/lieux/exporter`)(urlSearchParams, ['page'])}
      />
    ))
);
