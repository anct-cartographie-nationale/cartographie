'use client';

import type { ReactNode } from 'react';
import type { Departement, Region } from '@/libraries/collectivites';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { inject } from '@/libraries/injection';
import { load$, map$, setZoom, useMapLocation } from '@/libraries/map';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useSearchParams } from '@/libraries/nextjs/shim';
import { Subscribe, useTap } from '@/libraries/reactivity/Subscribe';
import type { BreadcrumbItem } from '@/libraries/ui/blocks/breadcrumbs';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { NextPageLink, PageLink, PreviousPageLink } from '@/libraries/ui/blocks/pagination/page-link';
import { Pagination } from '@/libraries/ui/blocks/pagination/pagination';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { MAP_CONFIG, TERRITOIRE_FILTER } from '@/shared/injection';
import { highlightDepartement } from '@/shared/ui/highlight-decoupage-administratif';
import { ExportLieux } from './export-lieux';
import { LieuxList } from './lieux-list';

export const DepartementLieuxPage = ({
  totalLieux,
  pageSize,
  currentPage,
  lieux,
  region,
  departement,
  breadcrumbsItems,
  exportHref
}: {
  totalLieux: number;
  pageSize: number;
  currentPage: number;
  lieux: LieuListItem[];
  region: Region;
  departement: Departement;
  breadcrumbsItems?: BreadcrumbItem[];
  exportHref?: string;
}): ReactNode => {
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);
  const location = useMapLocation();
  const customLocation = inject(MAP_CONFIG);
  const territoireFilter = inject(TERRITOIRE_FILTER);

  const isRegionFilter = territoireFilter.type === 'regions';
  const customZoom = customLocation.zoom;
  const isCustomZoomValid = !isRegionFilter && customZoom != null && customZoom > departement.zoom;

  const defaultLocation = {
    zoom: isCustomZoomValid ? customZoom : departement.zoom,
    latitude: isRegionFilter
      ? departement.localisation.latitude
      : (customLocation.latitude ?? departement.localisation.latitude),
    longitude: isRegionFilter
      ? departement.localisation.longitude
      : (customLocation.longitude ?? departement.localisation.longitude)
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
    highlightDepartement(map, departement.code);
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
      </main>
    </>
  );
};
