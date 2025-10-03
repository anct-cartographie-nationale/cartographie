'use client';

import { addOverlay, mapStyles, Overlay } from 'carte-facile';
import { Map as MapLibre, NavigationControl, type ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import { RiListUnordered } from 'react-icons/ri';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import france from '@/features/collectivites-territoriales/france.json';
import type { Region } from '@/features/collectivites-territoriales/region';
import { Subscribe } from '@/libraries/reactivity/Subscribe';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { cn } from '@/libraries/utils';
import { ClientOnly } from '@/libraries/utils/client-only';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from './cartographie-ids';
import { DepartementsOnMap } from './departements-on-map';
import { setBoundingBox } from './lieux/streams/bounding-box.stream';
import { setZoom, zoom$ } from './lieux/streams/zoom.stream';
import { LieuxOnMap } from './lieux-on-map';
import { RegionsOnMap } from './regions-on-map';

const config = france.find(({ nom }) => nom === 'France métropolitaine');

const handleZoomEnd = ({ target }: ViewStateChangeEvent) => {
  setZoom(target.getZoom());
};

const handleMoveEnd = ({ target }: ViewStateChangeEvent) => {
  const lngLatBounds = target.getBounds();
  setBoundingBox([lngLatBounds.getWest(), lngLatBounds.getSouth(), lngLatBounds.getEast(), lngLatBounds.getNorth()]);
};

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

  if (config == null) return null;

  setZoom(config.zoom);

  return (
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
          {(zoom) => (
            <MapLibre
              onZoomEnd={handleZoomEnd}
              onMoveEnd={handleMoveEnd}
              onLoad={({ target }) => {
                addOverlay(target, Overlay.administrativeBoundaries);
              }}
              id={CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID}
              initialViewState={{ ...config.localisation, zoom }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={mapStyles.simple}
            >
              {zoom <= 7 && <RegionsOnMap regions={regions} selectedRegion={selectedRegion} />}
              {zoom > 7 && zoom <= 9 && (
                <DepartementsOnMap departements={departements} regions={regions} selectedRegion={selectedRegion} />
              )}
              {zoom > 9 && <LieuxOnMap />}
              <NavigationControl position='bottom-right' showCompass={false} />
            </MapLibre>
          )}
        </Subscribe>
      </div>
    </ClientOnly>
  );
};
