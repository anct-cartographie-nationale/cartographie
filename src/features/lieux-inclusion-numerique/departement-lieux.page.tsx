'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { tap } from 'rxjs';
import { map$ } from '@/features/cartographie/map/streams/map.stream';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import { hrefWithSearchParams } from '@/libraries/next';
import { useSubscribe } from '@/libraries/reactivity/Subscribe';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { NextPageLink, PageLink, PreviousPageLink } from '@/libraries/ui/blocks/pagination/page-link';
import { Pagination } from '@/libraries/ui/blocks/pagination/pagination';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { ExportLieux } from './components/export-lieux';
import type { LieuListItem } from './lieu-list-item';
import { LieuxList } from './lieux-list';

export const DepartementLieuxPage = ({
  totalLieux,
  pageSize,
  curentPage,
  lieux,
  region,
  departement
}: {
  totalLieux: number;
  pageSize: number;
  curentPage: number;
  lieux: LieuListItem[];
  region: Region;
  departement: Departement;
}): ReactNode => {
  const searchParams = useSearchParams();
  const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);

  useSubscribe(
    map$.pipe(
      tap((map) =>
        map?.flyTo({
          center: [departement.localisation.longitude, departement.localisation.latitude],
          zoom: departement.zoom,
          duration: 400
        })
      )
    )
  );

  return (
    <>
      <SkipLinksPortal />
      <Breadcrumbs
        items={[
          { label: 'France', href: hrefWithSearchParams('/')(urlSearchParams, ['page']) },
          { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page']) },
          { label: departement.nom }
        ]}
      />
      <main id={contentId}>
        <div className='flex justify-between items-center gap-2 mb-4 mt-3'>
          <h1 className='font-bold uppercase text-xs text-base-title'>
            <span className='sr-only'>{departement.nom}</span> {totalLieux} lieux trouvés
          </h1>
          <ExportLieux
            lieuxCount={totalLieux}
            href={hrefWithSearchParams(`${departement.slug}/lieux/exporter`)(urlSearchParams, ['page'])}
          />
        </div>
        <LieuxList searchParams={urlSearchParams} lieux={lieux} className='flex flex-col gap-2' />
        <div className='text-center mt-10'>
          <Pagination
            curentPage={curentPage}
            itemsCount={totalLieux}
            pageSize={pageSize}
            siblingCount={1}
            href={hrefWithSearchParams()(urlSearchParams)}
            nav={{ previous: PreviousPageLink, next: NextPageLink }}
          >
            {PageLink}
          </Pagination>
        </div>
      </main>
    </>
  );
};
