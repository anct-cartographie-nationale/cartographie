import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { withDepartement, withRegion } from '@/features/collectivites-territoriales/middlewares/page';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
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
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { pageBuilder, withFetch, withPagination, withSearchParams, withUrlSearchParams } from '@/libraries/nextjs/page';
import { appPageTitle, pageSchema } from '@/libraries/utils';

type PageProps = {
  params: Promise<{ region: string; departement: string }>;
  searchParams?: Promise<{ page: string }>;
};

const PAGE_SIZE = 24;

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const departement: Departement | undefined = departements.find(departementMatchingSlug((await params).departement));
  return departement
    ? {
        title: appPageTitle('Liste des lieux', departement.nom),
        description: `Consultez la liste de tous les lieux d'inclusion numérique du département ${departement.nom}.`
      }
    : notFound();
};

export const generateStaticParams = () =>
  departements.map((departement: Departement) => {
    const region: Region | undefined = regions.find(regionMatchingDepartement(departement));
    return region ? { region: region.slug, departement: departement.slug } : null;
  });

export default pageBuilder()
  .use(withRegion(), withDepartement(), withSearchParams(filtersSchema), withUrlSearchParams())
  .use(withPagination(pageSchema))
  .use(
    withFetch('lieuxData', ({ departement, searchParams, page }) =>
      fetchLieux(departement)(searchParams, { page, limit: PAGE_SIZE })
    )
  )
  .render(async ({ region, departement, lieuxData: { lieux, total }, page, urlSearchParams }) => (
    <LieuxPage
      totalLieux={total}
      pageSize={PAGE_SIZE}
      currentPage={page}
      lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
      breadcrumbsItems={[
        { label: 'France', href: hrefWithSearchParams('/')(urlSearchParams, ['page']) },
        { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page']) },
        { label: departement.nom }
      ]}
      mapHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(urlSearchParams, ['page'])}
      exportHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/exporter`)(urlSearchParams, ['page'])}
    />
  ));
