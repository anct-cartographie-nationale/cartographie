import ClientLayout from '@/app/(with-map)/client.layout';
import { fetchDepartementsStats, fetchRegionsStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { layoutBuilder, withFetch, withSearchParamsFromHeaders } from '@/libraries/nextjs/layout';

const SIX_HOURS = 6 * 60 * 60;

export default layoutBuilder()
  .use(withSearchParamsFromHeaders(filtersSchema))
  .use(
    withFetch('regions', ({ searchParams }) => fetchRegionsStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['regions', searchParams], revalidate: SIX_HOURS }
    }),
    withFetch('departements', ({ searchParams }) => fetchDepartementsStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['departements', searchParams], revalidate: SIX_HOURS }
    })
  )
  .render(({ regions, departements }, children) => (
    <ClientLayout regions={regions} departements={departements}>
      {children}
    </ClientLayout>
  ));
