import { fetchAllStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { layoutBuilder, withFetch, withSearchParamsFromHeaders } from '@/libraries/nextjs/layout';
import ClientLayout from './client.layout';

export default layoutBuilder()
  .use(withSearchParamsFromHeaders(filtersSchema))
  .use(
    withFetch('stats', ({ searchParams }) => fetchAllStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['stats', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .render(({ stats: { regions, departements } }, children) => (
    <ClientLayout regions={regions} departements={departements}>
      {children}
    </ClientLayout>
  ));
