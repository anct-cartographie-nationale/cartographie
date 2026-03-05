import { RegionsPage } from '@/features/cartographie';
import { regions } from '@/features/collectivites-territoriales';
import { asCount, countFromHeaders } from '@/libraries/api/options';
import {
  applyFilters,
  filtersSchema,
  inclusionNumeriqueFetchApi,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';
import { page, withSearchParams } from '@/libraries/next/page';

export default page.with(withSearchParams()).render(async ({ searchParams }) => {
  const [, headers] = await inclusionNumeriqueFetchApi(
    LIEUX_ROUTE,
    ...asCount<LieuxRouteOptions>({ filter: applyFilters(filtersSchema.parse(searchParams)) })
  );

  return <RegionsPage totalLieux={countFromHeaders(headers)} regions={regions} />;
});
