'use client';

import type { ReactNode } from 'react';
import { setZoom } from '@/features/cartographie/lieux/streams/zoom.stream';
import france from '@/features/collectivites-territoriales/france.json';
import type { Region } from '@/features/collectivites-territoriales/region';
import { load$ } from '@/features/lieux-inclusion-numerique/load/load.stream';
import { inject, MAP_CONFIG } from '@/libraries/injection';
import { hrefWithSearchParams } from '@/libraries/next';
import { Link, useSearchParams } from '@/libraries/next-shim';
import { Subscribe, useTap } from '@/libraries/reactivity/Subscribe';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { removeHighlightDecoupageAdministratif } from './layers/highlight-decoupage-administratif';
import { map$ } from './map/streams/map.stream';

const defaultConfig = france.find(({ nom }): boolean => nom === 'France métropolitaine');

export const RegionsPage = ({ totalLieux, regions }: { totalLieux: number; regions: Region[] }): ReactNode => {
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);

  const mapConfig = inject(MAP_CONFIG);
  const hasCustomPosition = mapConfig?.latitude != null || mapConfig?.longitude != null || mapConfig?.zoom != null;

  useTap(map$, (map) => {
    if (!defaultConfig || hasCustomPosition) return;
    setZoom(defaultConfig.zoom);
    if (!map) return;
    map.flyTo({
      center: [defaultConfig.localisation.longitude, defaultConfig.localisation.latitude],
      zoom: defaultConfig.zoom,
      duration: 400
    });
    if (!map.isStyleLoaded()) return;
    removeHighlightDecoupageAdministratif(map);
  });

  if (!defaultConfig) return null;

  return (
    <>
      <SkipLinksPortal />
      <main id={contentId} className='flex flex-col justify-between h-full gap-16'>
        <div>
          <LocationFranceIllustration className='mb-6 mt-18' />
          <Subscribe to$={load$}>
            {(isLoading) => (
              <h1 className='mb-12 text-3xl text-base-title font-light'>
                <span className='font-bold'>
                  {isLoading ? (
                    'Chargement des lieux...'
                  ) : (
                    <>
                      {totalLieux} lieux
                      <br />
                      d’inclusion numérique
                    </>
                  )}
                </span>
              </h1>
            )}
          </Subscribe>
          <h2 className='font-bold uppercase text-xs text-base-title mb-3'>Filtrer par région</h2>
          <div className='flex flex-wrap gap-1.5'>
            {regions.map(({ nom, slug, code }) => (
              <Link
                href={hrefWithSearchParams(slug)(searchParams, ['page'])}
                key={code}
                className='tag badge-primary badge-soft'
              >
                {nom}
              </Link>
            ))}
          </div>
        </div>
        <div className='pb-8'>
          <ButtonLink
            className='border-base-200'
            kind='btn-outline'
            color='btn-primary'
            href={hrefWithSearchParams('/lieux')(searchParams)}
          >
            Afficher la liste des {totalLieux} lieux
          </ButtonLink>
        </div>
      </main>
    </>
  );
};
