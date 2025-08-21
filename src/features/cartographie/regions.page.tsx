'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import france from '@/features/collectivites-territoriales/france.json';
import type { Region } from '@/features/collectivites-territoriales/region';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from './cartographie-ids';

const config = france.find(({ nom }): boolean => nom === 'France métropolitaine');

export const RegionsPage = ({ regions }: { regions: Region[] }): ReactNode => {
  const map = useMap()[CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID];

  if (!config) return null;

  map?.flyTo({
    center: [config.localisation.longitude, config.localisation.latitude],
    zoom: config.zoom,
    duration: 400
  });

  return (
    <>
      <SkipLinksPortal />
      <LocationFranceIllustration className='mb-6 mt-18' />
      <main id={contentId}>
        <h1 className='mb-12 text-3xl text-base-title font-bold'>
          17345 lieux
          <br />
          d’inclusion numérique
        </h1>
        <h2 className='font-bold uppercase text-xs text-base-title mb-3'>Filtrer par région</h2>
        <div className='flex flex-wrap gap-1.5'>
          {regions.map(({ nom, slug, code }: Region) => (
            <Link href={slug} key={code} className='tag badge-primary badge-soft'>
              {nom}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};
