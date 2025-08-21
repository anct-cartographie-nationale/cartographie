'use client';

import type { ReactNode } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';
import { Link } from '@/libraries/ui/primitives/link';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from './cartographie-ids';

export const RegionPage = ({ region, departements }: { region: Region; departements: Departement[] }): ReactNode => {
  const map = useMap()[CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID];

  map?.flyTo({
    center: [region.localisation.longitude, region.localisation.latitude],
    zoom: region.zoom,
    duration: 400
  });

  return (
    <>
      <SkipLinksPortal />
      <div className='breadcrumbs text-sm'>
        <ul>
          <li>
            <Link href='/'>France</Link>
          </li>
          <li>{region.nom}</li>
        </ul>
      </div>
      <LocationFranceIllustration className='mt-10 mb-6' />
      <main id={contentId}>
        <h1 className='mb-12 text-3xl font-light'>
          {region.nom}
          <br />
          <span className='font-bold'>1065 lieux d’inclusion numérique</span>
        </h1>
        <h2 className='font-bold uppercase text-xs mb-3'>Filtrer par département</h2>
        <div className='flex flex-wrap gap-1.5'>
          {departements.map(({ code, slug, nom }) => (
            <Link href={`/${region.slug}/${slug}`} key={code} kind='link-hover' className='badge badge-primary badge-soft'>
              ({code}) {nom}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};
