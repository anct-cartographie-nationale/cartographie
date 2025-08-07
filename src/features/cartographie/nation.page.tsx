import Link from 'next/link';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';

export const NationPage = ({ regions }: { regions: { slug: string; nom: string }[] }) => (
  <>
    <SkipLinksPortal />
    <LocationFranceIllustration className='mb-6 mt-19' />
    <main id={contentId}>
      <h1 className='mb-12 text-3xl font-bold'>
        17345 lieux
        <br />
        d’inclusion numérique
      </h1>
      <h2 className='font-bold uppercase text-xs mb-3'>Filtrer par région</h2>
      <div className='flex flex-wrap gap-1.5'>
        {regions.map((region) => (
          <Link href={region.slug} key={region.slug} className='badge badge-primary badge-soft'>
            {region.nom}
          </Link>
        ))}
      </div>
    </main>
  </>
);
