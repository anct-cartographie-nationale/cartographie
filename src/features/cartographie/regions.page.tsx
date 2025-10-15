'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { tap } from 'rxjs';
import france from '@/features/collectivites-territoriales/france.json';
import type { Region } from '@/features/collectivites-territoriales/region';
import { useSubscribe } from '@/libraries/reactivity/Subscribe';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { map$ } from './map/streams/map.stream';

const config = france.find(({ nom }): boolean => nom === 'France métropolitaine');

export const RegionsPage = ({ totalLieux, regions }: { totalLieux: number; regions: Region[] }): ReactNode => {
  useSubscribe(
    map$.pipe(
      tap((map) => {
        if (!map || !config) return;
        map.flyTo({
          center: [config.localisation.longitude, config.localisation.latitude],
          zoom: config.zoom,
          duration: 400
        });
      })
    )
  );

  if (!config) return null;

  return (
    <>
      <SkipLinksPortal />
      <main id={contentId} className='flex flex-col justify-between h-full gap-16'>
        <div>
          <LocationFranceIllustration className='mb-6 mt-18' />
          <h1 className='mb-12 text-3xl text-base-title font-bold'>
            {totalLieux} lieux
            <br />
            d’inclusion numérique
          </h1>
          <h2 className='font-bold uppercase text-xs text-base-title mb-3'>Filtrer par région</h2>
          <div className='flex flex-wrap gap-1.5'>
            {regions.map(({ nom, slug, code }) => (
              <Link href={slug} key={code} className='tag badge-primary badge-soft'>
                {nom}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <ButtonLink className='border-base-200' kind='btn-outline' color='btn-primary' href='/lieux'>
            Afficher la liste des {totalLieux} lieux
          </ButtonLink>
        </div>
      </main>
    </>
  );
};
