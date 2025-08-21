'use client';

import type { ReactNode } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { Badge } from '@/libraries/ui/primitives/badge';
import { Link } from '@/libraries/ui/primitives/link';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from './cartographie-ids';

export const DepartementPage = ({ region, departement }: { region: Region; departement: Departement }): ReactNode => {
  const map = useMap()[CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID];

  map?.flyTo({
    center: [departement.localisation.longitude, departement.localisation.latitude],
    zoom: departement.zoom,
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
          <li>
            <Link href={`/${region.slug}`}>{region.nom}</Link>
          </li>
          <li>{departement.nom}</li>
        </ul>
      </div>
      <main id={contentId}>
        <h1 className='font-bold uppercase text-xs my-6'>
          <span className='sr-only'>{departement.nom}</span> 25 lieux trouvés
        </h1>
        <div className='card card-border'>
          <div className='card-body'>
            <div>
              <h2 className='card-title text-primary'>France services marianne</h2>
              <div></div>
            </div>
            <Badge color='badge-success'>Ouvert</Badge>
            <div className='flex gap-1 justify-between'>
              <div>Eloie</div>
              <div>à 5 Km</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
