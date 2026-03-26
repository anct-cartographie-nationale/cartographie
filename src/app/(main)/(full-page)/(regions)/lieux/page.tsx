import type { Metadata } from 'next';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { pageBuilder, withFetch, withPagination, withSearchParams, withUrlSearchParams } from '@/libraries/nextjs/page';
import { appPageTitle, pageSchema } from '@/libraries/utils';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: appPageTitle('Liste des lieux', 'France'),
  description: "Consultez la liste de tous les lieux d'inclusion numérique de France."
});

const PAGE_SIZE = 24;

export default pageBuilder()
  .use(withSearchParams(filtersSchema), withUrlSearchParams())
  .use(withPagination(pageSchema))
  .use(
    withFetch('totalLieux', ({ searchParams }) => countLieux()(searchParams)),
    withFetch('lieux', ({ searchParams, page }) => fetchLieux()(searchParams, { page, limit: PAGE_SIZE }))
  )
  .render(async ({ totalLieux, lieux, page, urlSearchParams }) => (
    <LieuxPage
      totalLieux={totalLieux}
      pageSize={PAGE_SIZE}
      currentPage={page}
      lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
      mapHref={hrefWithSearchParams('/')(urlSearchParams, ['page'])}
      exportHref={hrefWithSearchParams('/lieux/exporter')(urlSearchParams, ['page'])}
    />
  ));
