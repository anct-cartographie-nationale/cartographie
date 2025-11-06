import type { ReactNode } from 'react';
import { RiRoadMapLine } from 'react-icons/ri';
import { inject } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { NextPageLink, PageLink, PreviousPageLink } from '@/libraries/ui/blocks/pagination/page-link';
import { Pagination } from '@/libraries/ui/blocks/pagination/pagination';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { ExportLieux } from './components/export-lieux';
import type { LieuListItem } from './lieu-list-item';
import { LieuxList } from './lieux-list';

type LieuxPageProps = {
  breadcrumbsItems?: { label: string; href?: string }[];
  mapHref: string;
  exportHref: string;
  lieux: LieuListItem[];
  totalLieux: number;
  curentPage: number;
  pageSize: number;
};

export const LieuxPage = ({
  breadcrumbsItems = [],
  mapHref,
  exportHref,
  lieux,
  totalLieux,
  curentPage,
  pageSize
}: LieuxPageProps): ReactNode => {
  const searchParams = inject(URL_SEARCH_PARAMS);

  return (
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
        <div className='flex justify-between items-center gap-2 mb-4'>
          <h1 className='font-bold uppercase text-xs text-base-title'>{totalLieux} lieux trouvés</h1>
          <ExportLieux lieuxCount={totalLieux} href={exportHref} />
        </div>
        <LieuxList
          searchParams={searchParams}
          lieux={lieux}
          size='lg'
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'
        />
        <div className='text-center mt-10'>
          <Pagination
            curentPage={curentPage}
            itemsCount={totalLieux}
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
};
