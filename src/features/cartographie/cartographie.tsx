'use client';

import { mapStyles } from 'carte-facile';
import { Map as MapLibre, NavigationControl, type ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { RiListUnordered } from 'react-icons/ri';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import france from '@/features/collectivites-territoriales/france.json';
import { type Region, regionMatchingDepartement } from '@/features/collectivites-territoriales/region';
import { Subscribe } from '@/libraries/reactivity/Subscribe';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { cn } from '@/libraries/utils';
import { ClientOnly } from '@/libraries/utils/client-only';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from './cartographie-ids';
import { CollectiviteTerritorialeMarker } from './markers/collectivite-territoriale.marker';
import { LieuMarker } from './markers/lieu.marker';
import { setBoundingBox } from './streams/bounding-box.stream';
import { lieux$ } from './streams/lieux.steam';
import { setZoom, zoom$ } from './streams/zoom.stream';

const config = france.find(({ nom }) => nom === 'France métropolitaine');

export const Cartographie = ({
  regions,
  departements,
  selectedRegion,
  selectedDepartement
}: {
  regions: (Region & { nombreLieux: number })[];
  departements: (Departement & { nombreLieux: number })[];
  selectedRegion: Region | undefined;
  selectedDepartement: Departement | undefined;
}) => {
  const { theme } = useTheme();

  const handleZoomEnd = ({ target }: ViewStateChangeEvent) => {
    setZoom(target.getZoom());
  };

  const handleMoveEnd = ({ target }: ViewStateChangeEvent) => {
    const lngLatBounds = target.getBounds();
    setBoundingBox([lngLatBounds.getWest(), lngLatBounds.getSouth(), lngLatBounds.getEast(), lngLatBounds.getNorth()]);
  };

  return !config ? null : (
    <ClientOnly>
      <div className={cn('w-full h-full', theme === 'dark' && 'invert-90')}>
        {selectedRegion && selectedDepartement && (
          <ButtonLink
            href={`/${selectedRegion.slug}/${selectedDepartement.slug}/lieux`}
            color='btn-primary'
            className='absolute right-0 m-6 z-1'
          >
            <RiListUnordered aria-hidden={true} />
            Afficher la liste
          </ButtonLink>
        )}
        <Subscribe to$={zoom$} startWith={config.zoom}>
          {({ value: zoom }) => (
            <MapLibre
              onZoomEnd={handleZoomEnd}
              onMoveEnd={handleMoveEnd}
              id={CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID}
              initialViewState={{ ...config.localisation, zoom: zoom ?? config.zoom }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={mapStyles.simple}
            >
              {(zoom ?? config.zoom) <= 7 &&
                regions.map(({ code, localisation, slug, nom, nombreLieux }) => (
                  <Link href={`/${slug}`} key={code}>
                    <CollectiviteTerritorialeMarker
                      title={`Région ${nom}`}
                      isMuted={selectedRegion != null && selectedRegion.code !== code}
                      {...localisation}
                    >
                      {nombreLieux}
                    </CollectiviteTerritorialeMarker>
                  </Link>
                ))}
              {(zoom ?? config.zoom) > 7 &&
                (zoom ?? config.zoom) <= 9 &&
                departements.map(({ code, localisation, slug, nom, nombreLieux }) => (
                  <Link href={`/${regions.find(regionMatchingDepartement({ code }))?.slug}/${slug}`} key={code}>
                    <CollectiviteTerritorialeMarker
                      title={`Département ${nom}`}
                      isMuted={!selectedRegion?.departements.includes(code)}
                      {...localisation}
                    >
                      {nombreLieux}
                    </CollectiviteTerritorialeMarker>
                  </Link>
                ))}

              {(zoom ?? config.zoom) > 8.6 && (
                <Subscribe to$={lieux$}>
                  {({ value: lieux }) => lieux?.map((lieu) => <LieuMarker key={lieu.id} {...lieu} />)}
                </Subscribe>
              )}
              <NavigationControl position='bottom-right' showCompass={false} />
            </MapLibre>
          )}
        </Subscribe>
      </div>
    </ClientOnly>
  );
};
