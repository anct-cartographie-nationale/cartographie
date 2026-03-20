import { pipe } from 'effect';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appendCollectivites, withDepartement, withRegion } from '@/features/collectivites-territoriales';
import { DepartementLieuxPage } from '@/features/lieux-inclusion-numerique';
import { countLieuxForDepartement } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux-for-departement';
import { fetchLieuxForDepartement } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux-for-departement';
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
import { fromPage, render, use, withFetch, withPagination, withSearchParams } from '@/libraries/nextjs/page';
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

export default pipe(
  fromPage,
  (p) => use(p)(withRegion(), withDepartement(), withSearchParams(filtersSchema)),
  (p) => use(p)(withPagination(pageSchema)),
  (p) =>
    use(p)(
      withFetch('totalLieux', ({ departement, searchParams }) => countLieuxForDepartement(departement)(searchParams)),
      withFetch('lieux', ({ departement, searchParams, page }) =>
        fetchLieuxForDepartement(departement)(searchParams, { page, limit: PAGE_SIZE })
      )
    ),
  (p) =>
    render(p)(async ({ region, departement, totalLieux, lieux, page }) => (
      <DepartementLieuxPage
        totalLieux={totalLieux}
        pageSize={PAGE_SIZE}
        curentPage={page}
        lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
        region={region}
        departement={departement}
      />
    ))
);
