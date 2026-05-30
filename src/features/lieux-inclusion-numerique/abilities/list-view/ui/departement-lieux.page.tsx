'use client';

import { Breadcrumbs, NextPageLink, PageLink, Pagination, PreviousPageLink } from '@arckit/daisyui/blocks';
import type { Paginated } from '@arckit/resultset';
import type { ReactNode } from 'react';
import type { Departement, Region } from '@/libraries/collectivites';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useSearchParams } from '@/libraries/nextjs/shim';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { ExportLieux } from './export-lieux';
import { LieuxList } from './lieux-list';
import { useMapDepartementLocation } from './use-map-departement-location';

export const DepartementLieuxPage = ({
  paginated: { items, totalItems, currentPage, pageSize },
  region,
  departement,
  breadcrumbsItems,
  exportHref,
  children
}: {
  paginated: Paginated<LieuListItem>;
  region: Region;
  departement: Departement;
  breadcrumbsItems?: { label: string; href?: string }[];
  exportHref?: string;
  children?: ReactNode;
}): ReactNode => {
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);

  useMapDepartementLocation(departement);

  return (
    <>
      <SkipLinksPortal />
      <Breadcrumbs
        items={
          breadcrumbsItems ?? [
            { label: 'France', href: hrefWithSearchParams('/')(searchParams, ['page']) },
            { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(searchParams, ['page']) },
            { label: departement.nom }
          ]
        }
      />
      {children}
      <main id={contentId}>
        <div className='flex justify-between items-center gap-2 mb-4 mt-3'>
          <h1 className='font-bold uppercase text-xs text-base-title'>
            <span className='sr-only'>{departement.nom}</span>
            {totalItems} lieux trouvés
          </h1>
          <ExportLieux
            lieuxCount={totalItems}
            href={exportHref ?? hrefWithSearchParams(`${departement.slug}/lieux/exporter`)(searchParams, ['page'])}
          />
        </div>
        <LieuxList searchParams={searchParams} lieux={items} className='flex flex-col gap-2' />
        <div className='text-center mt-10'>
          <Pagination
            currentPage={currentPage}
            itemsCount={totalItems}
            pageSize={pageSize}
            siblingCount={1}
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
