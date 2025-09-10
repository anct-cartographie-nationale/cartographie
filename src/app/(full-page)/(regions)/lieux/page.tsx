import type { Metadata } from 'next';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, REGIONS_ROUTE } from '@/api/inclusion-numerique';
import { totalLieux } from '@/api/inclusion-numerique/transform/total-lieux';
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
    select: [
      'id',
      'nom',
      'adresse',
      'code_postal',
      'code_insee',
      'commune',
      'latitude',
      'longitude',
      'prise_rdv',
      'horaires',
      'dispositif_programmes_nationaux'
    ]
  });

  return <LieuxPage totalLieux={totalLieux(regionRouteResponse)} lieux={lieux.map(appendCollectivites)} mapHref='/' />;
};

export default Page;
