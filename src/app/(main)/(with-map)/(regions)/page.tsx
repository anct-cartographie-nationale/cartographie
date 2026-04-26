import { RegionsPage } from '@/features/cartographie';
import { countLieux } from '@/features/lieux-inclusion-numerique/abilities/count/count-lieux';
import { filterRegionsByTerritoire } from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { pageBuilder, withDerive, withFetch, withSearchParams } from '@/libraries/nextjs/page';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';

export default pageBuilder()
  .use(withSearchParams(filtersSchema))
  .use(
    withFetch('totalLieux', ({ searchParams }) => countLieux()(searchParams), {
      cache: { cacheKey: ({ searchParams }) => ['totalLieux', searchParams], revalidate: false, tags: ['lieux'] }
    }),
    withDerive('regions', ({ searchParams }) => filterRegionsByTerritoire(searchParams))
  )
  .render(async ({ totalLieux, regions }) => (
    <>
      <SkipLinksPortal />
      <main id={contentId} className='flex flex-col justify-between h-full gap-16'>
        <div>
          <LocationFranceIllustration className='mb-6 mt-18' />
          <h1 className='mb-12 text-3xl text-base-title font-light'>
            <span className='font-bold'>
              {totalLieux} {"lieux d'inclusion numérique"}
            </span>
          </h1>
          <RegionsPage totalLieux={totalLieux} regions={regions} />
        </div>
      </main>
    </>
  ));
