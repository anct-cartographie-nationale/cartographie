import type { ReactNode } from 'react';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteOptions } from '@/external-api/inclusion-numerique';
import { RegionsPage } from '@/features/cartographie/regions.page';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';

type PageProps = {
  searchParams?: Promise<{ page: string }>;
};

const Page = async ({ searchParams: searchParamsPromise }: PageProps): Promise<ReactNode> => {
  const searchParams = await searchParamsPromise;

  const [, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({ filter: applyFilters(filtersSchema.parse(searchParams)) })
  );

  return <RegionsPage totalLieux={countFromHeaders(headers)} regions={regions} />;
};

export default Page;
