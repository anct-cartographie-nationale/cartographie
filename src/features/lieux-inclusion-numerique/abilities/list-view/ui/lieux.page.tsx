import { Pagination } from '@arckit/daisyui/blocks';
import type { Paginated } from '@arckit/resultset';
import type { ReactNode } from 'react';
import { RiRoadMapLine } from 'react-icons/ri';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { NextPageLink, PageLink, PreviousPageLink } from '@/libraries/ui/blocks/pagination-links';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { InternalButtonLink } from '@/libraries/ui/primitives/internal-link';
import { ExportLieux } from './export-lieux';
import { LieuxCount } from './lieux-count';
import { LieuxList } from './lieux-list';

type LieuxPageProps = {
  breadcrumbsItems?: { label: string; href?: string }[];
  mapHref: string;
  exportHref: string;
  paginated: Paginated<LieuListItem>;
  searchParams: URLSearchParams;
};

export const LieuxPage = ({
  breadcrumbsItems = [],
  mapHref,
  exportHref,
  paginated: { items, totalItems, currentPage, pageSize },
  searchParams
}: LieuxPageProps): ReactNode => (
  <>
    <SkipLinksPortal />
    <main id={contentId} className='container mx-auto px-4'>
      <div className='py-6 flex justify-between align-center gap-4'>
        <Breadcrumbs items={breadcrumbsItems} className='flex-1 min-w-0' />
        <InternalButtonLink color='btn-primary' href={mapHref} className='ml-auto'>
          <RiRoadMapLine aria-hidden={true} />
          Afficher la carte
        </InternalButtonLink>
      </div>
      <div className='flex justify-between items-center gap-2 mb-4'>
        <LieuxCount totalLieux={totalItems} />
        <ExportLieux lieuxCount={totalItems} href={exportHref} />
      </div>
      <LieuxList
        searchParams={searchParams}
        lieux={items}
        size='lg'
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'
      />
      <div className='text-center mt-10'>
        <Pagination
          currentPage={currentPage}
          itemsCount={totalItems}
          pageSize={pageSize}
          href={hrefWithSearchParams()(searchParams)}
          nav={{ previous: PreviousPageLink, next: NextPageLink }}
        >
          {PageLink}
        </Pagination>
      </div>
    </main>
  </>
);
