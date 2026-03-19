import { pipe } from 'effect';
import { RegionsPage } from '@/features/cartographie';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filterRegionsByTerritoire } from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { fromPage, render, use, withDerive, withFetch, withSearchParams } from '@/libraries/nextjs/page';

export default pipe(
  fromPage,
  (p) => use(p)(withSearchParams(filtersSchema)),
  (p) =>
    use(p)(
      withFetch('totalLieux', ({ searchParams }) => countLieux(searchParams)),
      withDerive('regions', ({ searchParams }) => filterRegionsByTerritoire(searchParams))
    ),
  (p) => render(p)(async ({ totalLieux, regions }) => <RegionsPage totalLieux={totalLieux} regions={regions} />)
);
