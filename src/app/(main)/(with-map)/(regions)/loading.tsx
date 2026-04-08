import { regions } from '@/libraries/collectivites';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';
import { Button } from '@/libraries/ui/primitives/button';

export default function Loading() {
  return (
    <main id={contentId} className='flex flex-col justify-between h-full gap-16'>
      <div>
        <LocationFranceIllustration className='mb-6 mt-18' />
        <h1 className='mb-12 text-3xl text-base-title font-light'>
          <span className='font-bold'>Chargement des lieux...</span>
        </h1>
        <h2 className='font-bold uppercase text-xs text-base-title mb-3'>Filtrer par région</h2>
        <div className='flex flex-wrap gap-1.5'>
          {regions.map(({ nom, code }) => (
            <span key={code} className='tag badge-primary badge-soft'>
              {nom}
            </span>
          ))}
        </div>
      </div>
      <div className='pb-8'>
        <Button className='border-base-200' kind='btn-outline' color='btn-primary' disabled>
          <span className='loading loading-spinner loading-sm' />
          Chargement...
        </Button>
      </div>
    </main>
  );
}
