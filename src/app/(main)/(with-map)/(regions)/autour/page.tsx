import { withFetch } from '@arckit/nextjs/page';
import { withDecode, withPagination, withSearchParams } from '@arckit/nextjs/page/middlewares';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageBuilder } from '@/configuration/nextjs';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { LieuxAutourPage } from '@/features/lieux-inclusion-numerique';
import { fetchLieuxAutour } from '@/features/lieux-inclusion-numerique/abilities/list-view/query/fetch-lieux';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { autourLocalisation, autourSchema } from '@/libraries/inclusion-numerique-api/filters/autour';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { appPageTitle, pageSchema } from '@/libraries/utils';

const PAGE_SIZE = 10;

export const metadata: Metadata = {
  title: appPageTitle('Lieux les plus proches de votre recherche'),
  description: "Consultez les lieux d'inclusion numérique les plus proches de votre recherche.",
  robots: { index: false, follow: true }
};

export default pageBuilder()
  .use(withSearchParams())
  .use(withDecode('searchParams', filtersSchema.extend(autourSchema.shape), notFound))
  .use(withPagination((value) => pageSchema.parse(value)))
  .use(
    withFetch('lieuxData', ({ searchParams, page }) =>
      fetchLieuxAutour({ latitude: searchParams.lat, longitude: searchParams.lng })(searchParams, { page, limit: PAGE_SIZE })
    )
  )
  .render(async ({ searchParams: { lat, lng, adresse, commune, geolocalise }, lieuxData }) => (
    <LieuxAutourPage
      paginated={{
        ...lieuxData,
        items: lieuxData.items.map((lieu) =>
          toLieuListItem(autourLocalisation({ lat, lng, adresse, commune, geolocalise }))(appendCollectivites(lieu))
        )
      }}
      autour={{ lat, lng, adresse, commune, geolocalise }}
    />
  ));
