'use client';

import { addOverlay, mapStyles, Overlay } from 'carte-facile';
import { Map as MapLibre, NavigationControl, type ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { RiFullscreenExitLine, RiFullscreenLine, RiListUnordered, RiStackLine } from 'react-icons/ri';
import { FragiliteNumeriqueLayers } from '@/features/cartographie/fragilite-numerique-layers';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import france from '@/features/collectivites-territoriales/france.json';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import { load$ } from '@/features/lieux-inclusion-numerique/load/load.stream';
import { hrefWithSearchParams } from '@/libraries/next';
import { Subscribe } from '@/libraries/reactivity/Subscribe';
import { DropdownControls } from '@/libraries/ui/map/dropdown-controls';
import { Button } from '@/libraries/ui/primitives/button';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { Loading } from '@/libraries/ui/primitives/loading';
import { cn } from '@/libraries/utils';
import { ClientOnly } from '@/libraries/utils/client-only';
import { DepartementsOnMap } from './departements-on-map';
import { setBoundingBox } from './lieux/streams/bounding-box.stream';
import { setZoom, zoom$ } from './lieux/streams/zoom.stream';
import { LieuxOnMap } from './lieux-on-map';
import { setMap } from './map/streams/map.stream';
import { RegionsOnMap } from './regions-on-map';

const config = france.find(({ nom }) => nom === 'France métropolitaine');

export const saveMapLocation = (zoom: number, lng: number, lat: number) => {
  sessionStorage.setItem('mapLocation', JSON.stringify({ zoom, lng, lat }));
};

const handleZoomEnd = ({ target }: ViewStateChangeEvent) => {
  setZoom(target.getZoom());
};

const handleMoveEnd = ({ target }: ViewStateChangeEvent) => {
  const lngLatBounds = target.getBounds();
  setBoundingBox([lngLatBounds.getWest(), lngLatBounds.getSouth(), lngLatBounds.getEast(), lngLatBounds.getNorth()]);
  saveMapLocation(target.getZoom(), target.getCenter().lng, target.getCenter().lat);
};

export const Cartographie = ({
  regions,
  departements
}: {
  regions: (Region & { nombreLieux: number })[];
  departements: (Departement & { nombreLieux: number })[];
}) => {
  const pathname = usePathname();
  const [selectedRegionSlug, selectedDepartementSlug] = pathname.split('/').filter((segment) => segment.length > 0);
  const selectedRegion = regions.find(regionMatchingSlug(selectedRegionSlug));
  const selectedDepartement = departements.find(departementMatchingSlug(selectedDepartementSlug));
  const searchParams = useSearchParams();
  const [fullScreen, setFullScreen] = useState(false);
  const [fragiliteNumeriqueLayer, setFragiliteNumeriqueLayer] = useState<boolean>(false);
  const { theme } = useTheme();

  return config == null ? null : (
    <ClientOnly>
      <div className={cn('w-full h-full relative', fullScreen && 'absolute', theme === 'dark' && 'invert-90')}>
        <Subscribe to$={load$}>
          {(isLoading) =>
            isLoading && (
              <>
                <div className='absolute z-30 left-0 right-0 top-0 bottom-0 flex justify-center'>
                  <span className='bg-base-100 text-primary text-sm absolute my-8 py-2 px-4 rounded-lg shadow-lg'>
                    <Loading scale='loading-xs' isLoading />
                    &emsp;Chargement
                  </span>
                </div>
                <div className='bg-base-100 opacity-40 absolute z-20 left-0 right-0 top-0 bottom-0' />
              </>
            )
          }
        </Subscribe>
        {selectedRegion && selectedDepartement && (
          <ButtonLink
            href={hrefWithSearchParams(`/${selectedRegion.slug}/${selectedDepartement.slug}/lieux`)(
              new URLSearchParams(searchParams),
              ['page']
            )}
            color='btn-primary'
            className='absolute right-0 m-6 z-1 invisible lg:visible'
          >
            <RiListUnordered aria-hidden={true} />
            Afficher la liste
          </ButtonLink>
        )}
        <div className='absolute right-0 bottom-25 z-1 my-6 mx-2 invisible lg:visible'>
          <Button
            kind='btn-ghost'
            className='px-2 bg-base-100 text-primary shadow rounded'
            onClick={() => setFullScreen((prev) => !prev)}
          >
            {fullScreen ? <RiFullscreenExitLine size={24} /> : <RiFullscreenLine size={24} />}
          </Button>
        </div>
        <Subscribe to$={zoom$} startWith={config.zoom}>
          {(zoom) => (
            <MapLibre
              onZoomEnd={handleZoomEnd}
              onMoveEnd={handleMoveEnd}
              onLoad={({ target: map }) => {
                addOverlay(map, Overlay.administrativeBoundaries);
                setMap(map);
              }}
              initialViewState={{ ...config.localisation, zoom }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={mapStyles.simple}
            >
              <FragiliteNumeriqueLayers fragiliteNumeriqueLayer={fragiliteNumeriqueLayer} zoom={zoom} />
              {zoom <= 7 && <RegionsOnMap regions={regions} selectedRegion={selectedRegion} />}
              {zoom > 7 && zoom <= 9 && (
                <DepartementsOnMap departements={departements} regions={regions} selectedRegion={selectedRegion} />
              )}
              {zoom > 9 && <LieuxOnMap />}
              <NavigationControl position='bottom-right' showCompass={false} />
              <DropdownControls
                position='bottom-left'
                trigger={
                  <>
                    <RiStackLine />
                    Les indicateurs
                  </>
                }
                items={{
                  fragiliteNumerique: (
                    <Button
                      className='text-start inline'
                      kind='btn-ghost'
                      onClick={() => setFragiliteNumeriqueLayer((prev) => !prev)}
                    >
                      Fragilité numérique
                    </Button>
                  )
                }}
              />
            </MapLibre>
          )}
        </Subscribe>
      </div>
    </ClientOnly>
  );
};
