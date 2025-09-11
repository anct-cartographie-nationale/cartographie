import type { Metadata } from 'next';
import { inclusionNumeriqueFetchApi, LIEU_LIST_FIELDS, LIEUX_ROUTE, REGIONS_ROUTE } from '@/api/inclusion-numerique';
import { toLieuListItem } from '@/api/inclusion-numerique/transfer/toLieuListItem';
import { totalLieux } from '@/api/inclusion-numerique/transfer/total-lieux';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { appPageTitle } from '@/libraries/utils';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: appPageTitle('Liste des lieux', 'France'),
  description: "Consultez la liste de tous les lieux d'inclusion numérique de France."
});

const Page = async () => {
  const regionRouteResponse = await inclusionNumeriqueFetchApi(REGIONS_ROUTE);

  const lieux = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 24, offset: 0 },
    select: LIEU_LIST_FIELDS
  });

  return (
    <LieuxPage
      totalLieux={totalLieux(regionRouteResponse)}
      lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
      mapHref='/'
    />
  );
};

export default Page;
