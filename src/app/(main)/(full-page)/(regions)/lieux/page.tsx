import { withFetch } from '@arckit/nextjs/page';
import { withPagination, withSearchParams } from '@arckit/nextjs/page/middlewares';
import type { Metadata } from 'next';
import { pageBuilder } from '@/configuration/nextjs';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { fetchLieux } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { appPageTitle, pageSchema } from '@/libraries/utils';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: appPageTitle('Liste des lieux', 'France'),
  description: "Consultez la liste de tous les lieux d'inclusion numérique de France."
});

const PAGE_SIZE = 24;

export default pageBuilder()
  .use(withSearchParams((raw) => filtersSchema.parse(raw)))
  .use(withPagination((value) => pageSchema.parse(value)))
  .use(
    withFetch('lieuxData', ({ searchParams, page }) => fetchLieux()(searchParams, { page, limit: PAGE_SIZE }), {
      cache: {
        cacheKey: ({ searchParams, page }) => ['lieuxData', searchParams, page, PAGE_SIZE],
        revalidate: false,
        tags: ['lieux']
      }
    })
  )
  .render(async ({ lieuxData, urlSearchParams }) => (
    <LieuxPage
      paginated={{ ...lieuxData, items: lieuxData.items.map((lieu) => toLieuListItem()(appendCollectivites(lieu))) }}
      searchParams={urlSearchParams}
      mapHref={hrefWithSearchParams('/')(urlSearchParams, ['page'])}
      exportHref={hrefWithSearchParams('/lieux/exporter')(urlSearchParams, ['page'])}
    />
  ));
