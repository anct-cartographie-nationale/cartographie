import { RegionsPage } from '@/features/cartographie';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filterRegionsByTerritoire } from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { pageBuilder, withDerive, withFetch, withSearchParams } from '@/libraries/nextjs/page';

export default pageBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('totalLieux', ({ searchParams }) => countLieux()(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['totalLieux', searchParams], revalidate: false, tags: ['lieux'] }
    }),
    withDerive('regions', ({ searchParams }) => filterRegionsByTerritoire(searchParams))
  )
  .render(async ({ totalLieux, regions }) => <RegionsPage totalLieux={totalLieux} regions={regions} />);
