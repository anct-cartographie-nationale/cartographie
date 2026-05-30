import { withFetch } from '@arckit/nextjs/page';
import { withPagination, withSearchParams } from '@arckit/nextjs/page/middlewares';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageBuilder } from '@/configuration/nextjs';
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
  .use(
    withRegion(),
    withDepartement(),
    withSearchParams((raw) => filtersSchema.parse(raw))
  )
  .use(withPagination((value) => pageSchema.parse(value)))
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
  .render(async ({ region, departement, lieuxData, urlSearchParams }) => (
    <LieuxPage
      paginated={{ ...lieuxData, items: lieuxData.items.map((lieu) => toLieuListItem()(appendCollectivites(lieu))) }}
      searchParams={urlSearchParams}
      breadcrumbsItems={[
        { label: 'France', href: hrefWithSearchParams('/')(urlSearchParams, ['page']) },
        { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page']) },
        { label: departement.nom }
      ]}
      mapHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(urlSearchParams, ['page'])}
      exportHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/exporter`)(urlSearchParams, ['page'])}
    />
  ));
