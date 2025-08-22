'use client';

import { mapStyles } from 'carte-facile';
import { Map as MapLibre, NavigationControl, useMap } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { RiListUnordered } from 'react-icons/ri';
import { type Departement, departementMatchingCode } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import france from '@/features/collectivites-territoriales/france.json';
import type { Region } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { cn } from '@/libraries/utils';
import { ClientOnly } from '@/libraries/utils/client-only';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from './cartographie-ids';
import { CollectiviteTerritorialeMarker } from './markers/collectivite-territoriale.marker';

const config = france.find(({ nom }) => nom === 'France métropolitaine');

export const Cartographie = ({
  selectedRegion,
  selectedDepartement
}: {
  selectedRegion: Region | undefined;
  selectedDepartement: Departement | undefined;
}) => {
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(config?.zoom ?? 0);
  const map = useMap()[CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID];

  if (!config) return null;

  return (
    <ClientOnly>
      <div className={cn('w-full h-full', theme === 'dark' && 'invert-90')}>
        {selectedRegion && selectedDepartement && (
          <ButtonLink
            href={`/${selectedRegion.slug}/${selectedDepartement.slug}/lieux`}
            color='btn-primary'
            className='absolute right-0 m-6 z-1'
          >
            <RiListUnordered />
            Afficher la liste
          </ButtonLink>
        )}
        <MapLibre
          onZoomEnd={() => setZoom(map?.getZoom() ?? config.zoom)}
          id={CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID}
          initialViewState={{ ...config.localisation, zoom }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyles.simple}
        >
          {(map?.getZoom() ?? 0) <= 7 &&
            regions.map(({ code, localisation, slug, nom }) => (
              <Link href={`/${slug}`} key={code}>
                <CollectiviteTerritorialeMarker
                  className='cursor-pointer'
                  title={`Région ${nom}`}
                  isMuted={selectedRegion != null && selectedRegion.code !== code}
                  {...localisation}
                >
                  {code}
                </CollectiviteTerritorialeMarker>
              </Link>
            ))}
          {(map?.getZoom() ?? 0) > 7 &&
            departements.map(({ code, localisation, slug, nom }) => (
              <Link href={`/${regions.find(departementMatchingCode(code))?.slug}/${slug}`} key={code}>
                <CollectiviteTerritorialeMarker
                  className='cursor-pointer'
                  title={`Département ${nom}`}
                  isMuted={!selectedRegion?.departements.includes(code)}
                  {...localisation}
                >
                  {code}
                </CollectiviteTerritorialeMarker>
              </Link>
            ))}
          <NavigationControl position='bottom-right' showCompass={false} />
        </MapLibre>
      </div>
    </ClientOnly>
  );
};
