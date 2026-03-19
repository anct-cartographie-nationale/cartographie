import { RegionsPage } from '@/features/cartographie';
import { asCount, countFromHeaders } from '@/libraries/api/options';
import { filterRegionsByTerritoire } from '@/libraries/collectivites';
import {
  applyFilters,
  filtersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';
import { page, withSearchParams } from '@/libraries/nextjs/page';

export default page.with(withSearchParams()).render(async ({ searchParams }) => {
  const filters = filtersSchema.parse(searchParams);

  const [, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({ filter: applyFilters(filters) })
  );

  const filteredRegions = filterRegionsByTerritoire({
    territoire_type: filters.territoire_type,
    territoires: filters.territoires
  });

  return <RegionsPage totalLieux={countFromHeaders(headers)} regions={filteredRegions} />;
});
