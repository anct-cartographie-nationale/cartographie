import type { ReactNode } from 'react';
import { inclusionNumeriqueFetchApi, REGIONS_ROUTE } from '@/api/inclusion-numerique';
import { totalLieux } from '@/api/inclusion-numerique/transform/total-lieux';
import { RegionsPage } from '@/features/cartographie/regions.page';
import regions from '@/features/collectivites-territoriales/regions.json';

const Page = async (): Promise<ReactNode> => {
  const regionRouteResponse = await inclusionNumeriqueFetchApi(REGIONS_ROUTE);

  return <RegionsPage totalLieux={totalLieux(regionRouteResponse)} regions={regions} />;
};

export default Page;
