'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { tap } from 'rxjs';
import { HighlightDepartement } from '@/features/cartographie/layers/highlight-decoupage-administratif';
import { map$ } from '@/features/cartographie/map/streams/map.stream';
import { useMapLocation } from '@/features/cartographie/search-params';
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
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);
  const location = useMapLocation();

  const defaultLocation = {
    zoom: departement.zoom,
    latitude: departement.localisation.latitude,
    longitude: departement.localisation.longitude
  };

  const initialLocation = (location?.zoom ?? 0) > 9 ? { ...defaultLocation, ...location } : defaultLocation;

  useSubscribe(
    map$.pipe(
      tap((map) => {
        if (!map) return;
        HighlightDepartement(map, departement.code);
        map.flyTo({
          center: [initialLocation.longitude, initialLocation.latitude],
          zoom: initialLocation.zoom,
          duration: 400
        });
      })
    )
  );

  return (
    <>
      <SkipLinksPortal />
      <Breadcrumbs
        items={[
          { label: 'France', href: hrefWithSearchParams('/')(searchParams, ['page']) },
          { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(searchParams, ['page']) },
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
            href={hrefWithSearchParams(`${departement.slug}/lieux/exporter`)(searchParams, ['page'])}
          />
        </div>
        <LieuxList searchParams={searchParams} lieux={lieux} className='flex flex-col gap-2' />
        <div className='text-center mt-10'>
          <Pagination
            curentPage={curentPage}
            itemsCount={totalLieux}
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
