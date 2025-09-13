'use client';

import type { ReactNode } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from '@/features/cartographie/cartographie-ids';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { NextPageLink, PageLink, PreviousPageLink } from '@/libraries/ui/blocks/pagination/page-link';
import { Pagination } from '@/libraries/ui/blocks/pagination/pagination';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
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
  const map = useMap()[CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID];

  map?.flyTo({
    center: [departement.localisation.longitude, departement.localisation.latitude],
    zoom: departement.zoom,
    duration: 400
  });

  return (
    <>
      <SkipLinksPortal />
      <Breadcrumbs
        items={[{ label: 'France', href: '/' }, { label: region.nom, href: `/${region.slug}` }, { label: departement.nom }]}
      />
      <main id={contentId}>
        <h1 className='font-bold uppercase text-xs text-base-title my-6'>
          <span className='sr-only'>{departement.nom}</span> {totalLieux} lieux trouvés
        </h1>
        <LieuxList lieux={lieux} className='flex flex-col gap-2' />
        <div className='text-center mt-10'>
          <Pagination
            curentPage={curentPage}
            itemsCount={totalLieux}
            pageSize={pageSize}
            siblingCount={1}
            nav={{ previous: PreviousPageLink, next: NextPageLink }}
          >
            {PageLink}
          </Pagination>
        </div>
      </main>
    </>
  );
};
