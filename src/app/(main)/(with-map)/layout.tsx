import { layoutBuilder, withFetch, withSearchParamsFromHeaders } from '@arckit/nextjs/layout';
import { fetchAllStats } from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import ClientLayout from './client.layout';

export default layoutBuilder()
  .use(withSearchParamsFromHeaders((raw) => filtersSchema.parse(raw)))
  .use(
    withFetch('stats', ({ searchParams }) => fetchAllStats(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['stats', searchParams], revalidate: false, tags: ['lieux'] }
    })
  )
  .render(async ({ stats: { regions, departements } }, { children }) => (
    <ClientLayout regions={regions} departements={departements}>
      {children}
    </ClientLayout>
  ));
