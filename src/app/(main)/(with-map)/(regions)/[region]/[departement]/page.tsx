import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { withDepartement, withRegion } from '@/features/collectivites-territoriales/middlewares/page';
import { DepartementLieuxPage } from '@/features/lieux-inclusion-numerique';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import {
  type Departement,
  departementMatchingSlug,
  departements,
  type Region,
  regionMatchingDepartement,
  regions
} from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { pageBuilder, withFetch, withPagination, withSearchParams } from '@/libraries/nextjs/page';
import { appPageTitle, pageSchema } from '@/libraries/utils';

type PageProps = {
  params: Promise<{ region: string; departement: string }>;
  searchParams?: Promise<{ page: string }>;
};

const PAGE_SIZE = 10;

export const generateStaticParams = () =>
  departements.map((departement: Departement) => {
    const region: Region | undefined = regions.find(regionMatchingDepartement(departement));
    return region ? { region: region.slug, departement: departement.slug } : null;
  });

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const departement: Departement | undefined = departements.find(departementMatchingSlug((await params).departement));
  return departement
    ? {
        title: appPageTitle(departement.nom),
        description: `Consultez les lieux d'inclusion numérique du département ${departement.nom}.`
      }
    : notFound();
};

export default pageBuilder()
  .use(withRegion(), withDepartement(), withSearchParams(filtersSchema))
  .use(withPagination(pageSchema))
  .use(
    withFetch(
      'lieuxData',
      ({ departement, searchParams, page }) => fetchLieux(departement)(searchParams, { page, limit: PAGE_SIZE }),
      {
        cache: {
          cacheKey: ({ departement, searchParams, page }) => [
            'lieuxData',
            'departement',
            departement.code,
            searchParams,
            page,
            PAGE_SIZE
          ],
          revalidate: false,
          tags: ['lieux']
        }
      }
    )
  )
  .render(async ({ region, departement, lieuxData: { lieux, total }, page }) => (
    <DepartementLieuxPage
      totalLieux={total}
      pageSize={PAGE_SIZE}
      currentPage={page}
      lieux={lieux.map((lieu) => toLieuListItem()(appendCollectivites(lieu)))}
      region={region}
      departement={departement}
    />
  ));
