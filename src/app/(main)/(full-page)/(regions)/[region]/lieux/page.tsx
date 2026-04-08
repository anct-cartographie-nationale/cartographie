import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { withRegion } from '@/features/collectivites-territoriales/middlewares/page';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { type Region, regionMatchingSlug, regions } from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { pageBuilder, withFetch, withPagination, withSearchParams, withUrlSearchParams } from '@/libraries/nextjs/page';
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

export default pageBuilder()
  .use(withRegion(), withSearchParams(filtersSchema), withUrlSearchParams())
  .use(withPagination(pageSchema))
  .use(withFetch('lieuxData', ({ region, searchParams, page }) => fetchLieux(region)(searchParams, { page, limit: PAGE_SIZE })))
  .render(async ({ region, lieuxData: { lieux, total }, page, urlSearchParams }) => (
    <LieuxPage
      totalLieux={total}
      pageSize={PAGE_SIZE}
      currentPage={page}
      lieux={lieux.map((lieu) => toLieuListItem()(appendCollectivites(lieu)))}
      breadcrumbsItems={[
        { label: 'France', href: hrefWithSearchParams('/')(urlSearchParams, ['page']) },
        { label: region.nom }
      ]}
      mapHref={hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page'])}
      exportHref={hrefWithSearchParams(`/${region.slug}/lieux/exporter`)(urlSearchParams, ['page'])}
    />
  ));
