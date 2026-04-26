'use client';

import type { ReactNode } from 'react';
import type { Departement, Region } from '@/libraries/collectivites';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useSearchParams } from '@/libraries/nextjs/shim';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { NextPageLink, PageLink, PreviousPageLink } from '@/libraries/ui/blocks/pagination/page-link';
import { Pagination } from '@/libraries/ui/blocks/pagination/pagination';
import { ExportLieux } from './export-lieux';
import { LieuxList } from './lieux-list';
import { useMapDepartementLocation } from './use-map-departement-location';

export const DepartementLieuxPage = ({
  totalLieux,
  pageSize,
  currentPage,
  lieux,
  region,
  departement,
  exportHref,
  children
}: {
  totalLieux: number;
  pageSize: number;
  currentPage: number;
  lieux: LieuListItem[];
  region: Region;
  departement: Departement;
  exportHref?: string;
  children?: ReactNode;
}): ReactNode => {
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);

  useMapDepartementLocation(departement);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'France', href: hrefWithSearchParams('/')(searchParams, ['page']) },
          { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(searchParams, ['page']) },
          { label: departement.nom }
        ]}
      />
      {children}
      <div className='flex justify-between items-center gap-2 mb-4 mt-3'>
        <h1 className='font-bold uppercase text-xs text-base-title'>
          <span className='sr-only'>{departement.nom}</span>
          {totalLieux} lieux trouvés
        </h1>
        <ExportLieux
          lieuxCount={totalLieux}
          href={exportHref ?? hrefWithSearchParams(`${departement.slug}/lieux/exporter`)(searchParams, ['page'])}
        />
      </div>
      <LieuxList searchParams={searchParams} lieux={lieux} className='flex flex-col gap-2' />
      <div className='text-center mt-10'>
        <Pagination
          currentPage={currentPage}
          itemsCount={totalLieux}
          pageSize={pageSize}
          siblingCount={1}
          href={hrefWithSearchParams()(searchParams)}
          nav={{ previous: PreviousPageLink, next: NextPageLink }}
        >
          {PageLink}
        </Pagination>
      </div>
    </>
  );
};
