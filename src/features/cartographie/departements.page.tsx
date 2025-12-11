'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { tap } from 'rxjs';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import { load$ } from '@/features/lieux-inclusion-numerique/load/load.stream';
import { hrefWithSearchParams } from '@/libraries/next';
import { Subscribe, useSubscribe } from '@/libraries/reactivity/Subscribe';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { Link } from '@/libraries/ui/primitives/link';
import { HighlightRegion } from './layers/highlight-decoupage-administratif';
import { setZoom } from './lieux/streams/zoom.stream';
import { map$ } from './map/streams/map.stream';

export const DepartementsPage = ({
  region,
  departements,
  totalLieux
}: {
  region: Region;
  departements: Departement[];
  totalLieux: number;
}): ReactNode => {
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);

  useSubscribe(
    map$.pipe(
      tap((map) => {
        if (!map) return;
        HighlightRegion(map, region.code);
        setZoom(region.zoom);
        map.flyTo({
          center: [region.localisation.longitude, region.localisation.latitude],
          zoom: region.zoom,
          duration: 400
        });
      })
    )
  );

  return (
    <>
      <SkipLinksPortal />
      <main id={contentId} className='flex flex-col justify-between h-full gap-16'>
        <div>
          <Breadcrumbs items={[{ label: 'France', href: hrefWithSearchParams('/')(searchParams) }, { label: region.nom }]} />
          <LocationFranceIllustration className='mt-10 mb-6' />
          <Subscribe to$={load$}>
            {(isLoading) => (
              <h1 className='mb-12 text-3xl text-base-title font-light'>
                {region.nom}
                <br />
                <span className='font-bold'>
                  {isLoading ? 'Chargement des lieux...' : <>{totalLieux} lieux d’inclusion numérique</>}
                </span>
              </h1>
            )}
          </Subscribe>

          <h2 className='font-bold uppercase text-xs text-base-title mb-3'>Filtrer par département</h2>
          <div className='flex flex-wrap gap-1.5'>
            {departements.map(({ code, slug, nom }) => (
              <Link
                href={hrefWithSearchParams(`/${region.slug}/${slug}`)(searchParams, ['page'])}
                key={code}
                className='tag badge-primary badge-soft'
              >
                ({code}) {nom}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <ButtonLink
            href={hrefWithSearchParams(`/${region.slug}/lieux`)(searchParams)}
            className='border-base-200'
            kind='btn-outline'
            color='btn-primary'
          >
            Afficher la liste des {totalLieux} lieux
          </ButtonLink>
        </div>
      </main>
    </>
  );
};
