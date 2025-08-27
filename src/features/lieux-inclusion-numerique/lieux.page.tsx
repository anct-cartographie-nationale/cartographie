import type { ReactNode } from 'react';
import { RiRoadMapLine } from 'react-icons/ri';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import lieux from './lieux.json';
import { LieuxList } from './lieux-list';

type LieuxPageProps = {
  breadcrumbsItems?: { label: string; href?: string }[];
  mapHref: string;
};

export const LieuxPage = ({ breadcrumbsItems = [], mapHref }: LieuxPageProps): ReactNode => (
  <>
    <SkipLinksPortal />
    <main id={contentId} className='container mx-auto px-4'>
      <div className='py-6 flex justify-between align-center gap-4'>
        <Breadcrumbs items={breadcrumbsItems} />
        <ButtonLink color='btn-primary' href={mapHref} className='ml-auto'>
          <RiRoadMapLine aria-hidden={true} />
          Afficher la carte
        </ButtonLink>
      </div>
      <h1 className='font-bold uppercase text-xs text-base-title mb-6'>{lieux.length} lieux trouvés</h1>
      <LieuxList lieux={lieux} size='lg' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2' />
    </main>
  </>
);
