import { RiRoadMapLine } from 'react-icons/ri';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { LieuxListSkeleton } from '@/libraries/ui/blocks/loading';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { Button } from '@/libraries/ui/primitives/button';

export default function Loading() {
  return (
    <main id={contentId} className='container mx-auto px-4'>
      <div className='py-6 flex justify-between align-center gap-4'>
        <Breadcrumbs items={[{ label: 'France', href: '/' }, { label: 'Liste des lieux' }]} />
        <Button color='btn-primary' className='ml-auto' disabled>
          <RiRoadMapLine aria-hidden={true} />
          Afficher la carte
        </Button>
      </div>
      <div className='flex justify-between items-center gap-2 mb-4'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <span className='loading loading-spinner loading-sm' />
          Chargement des lieux...
        </h1>
        <Button color='btn-primary' kind='btn-outline' scale='btn-sm' disabled>
          Exporter
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
        <LieuxListSkeleton count={12} />
      </div>
    </main>
  );
}
