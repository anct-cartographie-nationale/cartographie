import { pipe } from 'effect';
import type { Metadata } from 'next';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
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

export const generateMetadata = async (): Promise<Metadata> => ({
  title: appPageTitle('Liste des lieux', 'France'),
  description: "Consultez la liste de tous les lieux d'inclusion numérique de France."
});

const PAGE_SIZE = 24;

export default pipe(
  fromPage,
  (p) => use(p)(withSearchParams(filtersSchema), withUrlSearchParams()),
  (p) => use(p)(withPagination(pageSchema)),
  (p) =>
    use(p)(
      withFetch('totalLieux', ({ searchParams }) => countLieux(searchParams)),
      withFetch('lieux', ({ searchParams, page }) => fetchLieux(searchParams, { page, limit: PAGE_SIZE }))
    ),
  (p) =>
    render(p)(async ({ totalLieux, lieux, page, urlSearchParams }) => (
      <LieuxPage
        totalLieux={totalLieux}
        pageSize={PAGE_SIZE}
        curentPage={page}
        lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
        mapHref={hrefWithSearchParams('/')(urlSearchParams, ['page'])}
        exportHref={hrefWithSearchParams('/lieux/exporter')(urlSearchParams, ['page'])}
      />
    ))
);
