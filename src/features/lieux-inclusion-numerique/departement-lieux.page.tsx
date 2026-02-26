'use client';

import type { ReactNode } from 'react';
import { HighlightDepartement } from '@/features/cartographie/layers/highlight-decoupage-administratif';
import { setZoom } from '@/features/cartographie/lieux/streams/zoom.stream';
import { map$ } from '@/features/cartographie/map/streams/map.stream';
import { useMapLocation } from '@/features/cartographie/search-params';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import type { BreadcrumbItem } from '@/libraries/breadcrumb/filter-breadcrumb-items';
import { hrefWithSearchParams } from '@/libraries/next';
import { useSearchParams } from '@/libraries/next-shim';
import { Subscribe, useTap } from '@/libraries/reactivity/Subscribe';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { NextPageLink, PageLink, PreviousPageLink } from '@/libraries/ui/blocks/pagination/page-link';
import { Pagination } from '@/libraries/ui/blocks/pagination/pagination';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { ExportLieux } from './components/export-lieux';
import type { LieuListItem } from './lieu-list-item';
import { LieuxList } from './lieux-list';
import { load$ } from './load/load.stream';

export const DepartementLieuxPage = ({
  totalLieux,
  pageSize,
  curentPage,
  lieux,
  region,
  departement,
  breadcrumbsItems,
  exportHref
}: {
  totalLieux: number;
  pageSize: number;
  curentPage: number;
  lieux: LieuListItem[];
  region: Region;
  departement: Departement;
  breadcrumbsItems?: BreadcrumbItem[];
  exportHref?: string;
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

  useTap(map$, (map) => {
    setZoom(initialLocation.zoom);
    if (!map) return;
    map.flyTo({
      center: [initialLocation.longitude, initialLocation.latitude],
      zoom: initialLocation.zoom,
      duration: 400
    });
    if (!map.isStyleLoaded()) return;
    HighlightDepartement(map, departement.code);
  });

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'France', href: hrefWithSearchParams('/')(searchParams, ['page']) },
    { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(searchParams, ['page']) },
    { label: departement.nom }
  ];

  return (
    <>
      <SkipLinksPortal />
      <Breadcrumbs items={breadcrumbsItems ?? defaultBreadcrumbs} />
      <main id={contentId}>
        <div className='flex justify-between items-center gap-2 mb-4 mt-3'>
          <Subscribe to$={load$}>
            {(isLoading) => {
              return (
                <h1 className='font-bold uppercase text-xs text-base-title'>
                  <span className='sr-only'>{departement.nom}</span>
                  {isLoading ? 'Chargement des lieux...' : <>{totalLieux} lieux trouvés</>}
                </h1>
              );
            }}
          </Subscribe>
          <ExportLieux
            lieuxCount={totalLieux}
            href={exportHref ?? hrefWithSearchParams(`${departement.slug}/lieux/exporter`)(searchParams, ['page'])}
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
