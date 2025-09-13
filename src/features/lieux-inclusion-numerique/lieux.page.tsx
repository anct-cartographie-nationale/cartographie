import type { ReactNode } from 'react';
import { RiRoadMapLine } from 'react-icons/ri';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { NextPageLink, PageLink, PreviousPageLink } from '@/libraries/ui/blocks/pagination/page-link';
import { Pagination } from '@/libraries/ui/blocks/pagination/pagination';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import type { LieuListItem } from './lieu-list-item';
import { LieuxList } from './lieux-list';

type LieuxPageProps = {
  breadcrumbsItems?: { label: string; href?: string }[];
  href: string;
  lieux: LieuListItem[];
  totalLieux: number;
  curentPage: number;
  pageSize: number;
};

export const LieuxPage = ({
  breadcrumbsItems = [],
  href,
  lieux,
  totalLieux,
  curentPage,
  pageSize
}: LieuxPageProps): ReactNode => (
  <>
    <SkipLinksPortal />
    <main id={contentId} className='container mx-auto px-4'>
      <div className='py-6 flex justify-between align-center gap-4'>
        <Breadcrumbs items={breadcrumbsItems} />
        <ButtonLink color='btn-primary' href={href} className='ml-auto'>
          <RiRoadMapLine aria-hidden={true} />
          Afficher la carte
        </ButtonLink>
      </div>
      <h1 className='font-bold uppercase text-xs text-base-title mb-6'>{totalLieux} lieux trouvés</h1>
      <LieuxList lieux={lieux} size='lg' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2' />
      <div className='text-center mt-10'>
        <Pagination
          curentPage={curentPage}
          itemsCount={totalLieux}
          pageSize={pageSize}
          nav={{ previous: PreviousPageLink, next: NextPageLink }}
        >
          {PageLink}
        </Pagination>
      </div>
    </main>
  </>
);
