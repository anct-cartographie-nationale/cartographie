'use client';

import { addOverlay, mapStyles, Overlay } from 'carte-facile';
import { Map as MapLibre, NavigationControl, type ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { RiFullscreenExitLine, RiFullscreenLine, RiListUnordered, RiStackLine } from 'react-icons/ri';
import { MatomoAction, MatomoCategory, trackEvent } from '@/libraries/analytics';
import { type Departement, departementMatchingSlug, france, type Region, regionMatchingSlug } from '@/libraries/collectivites';
import { inject } from '@/libraries/injection';
import { load$, setBoundingBox, setMap, setZoom, zoom$ } from '@/libraries/map';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { usePathname, useSearchParams } from '@/libraries/nextjs/shim';
import { Subscribe } from '@/libraries/reactivity/Subscribe';
import { DropdownControls } from '@/libraries/ui/map/dropdown-controls';
import { Button } from '@/libraries/ui/primitives/button';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { Loading } from '@/libraries/ui/primitives/loading';
import { cn } from '@/libraries/utils';
import { ClientOnly } from '@/libraries/utils/client-only';
import { MAP_CONFIG } from '@/shared/injection';
import { DepartementsOnMap } from './departements-on-map';
import { FragiliteNumeriqueLayers } from './fragilite-numerique-layers';
import { RegionsOnMap } from './regions-on-map';

const defaultConfig = france.find(({ nom }) => nom === 'France métropolitaine');

let saveMapLocationTimer: ReturnType<typeof setTimeout> | undefined;

export const saveMapLocation = (zoom: number, lng: number, lat: number) => {
  clearTimeout(saveMapLocationTimer);
  saveMapLocationTimer = setTimeout(() => {
    sessionStorage.setItem('mapLocation', JSON.stringify({ zoom, lng, lat }));
  }, 500);
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
  departements,
  lieuxSlot
}: {
  regions: (Region & { nombreLieux: number })[];
  departements: (Departement & { nombreLieux: number })[];
  lieuxSlot?: ReactNode;
}) => {
  const pathname = usePathname();
  const [selectedRegionSlug, selectedDepartementSlug] = pathname.split('/').filter((segment) => segment.length > 0);
  const selectedRegion = regions.find(regionMatchingSlug(selectedRegionSlug));
  const selectedDepartement = departements.find(departementMatchingSlug(selectedDepartementSlug));
  const searchParams = useSearchParams();
  const [fullScreen, setFullScreen] = useState(false);
  const [fragiliteNumeriqueLayer, setFragiliteNumeriqueLayer] = useState<boolean>(false);
  const { theme } = useTheme();

  if (defaultConfig == null) return null;

  const mapConfig = inject(MAP_CONFIG);
  const config = {
    zoom: mapConfig?.zoom ?? defaultConfig?.zoom,
    localisation: {
      latitude: mapConfig?.latitude ?? defaultConfig.localisation.latitude,
      longitude: mapConfig?.longitude ?? defaultConfig.localisation.longitude
    }
  };

  return (
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
            onClick={() => {
              trackEvent({
                category: MatomoCategory.MAP,
                action: MatomoAction.FULLSCREEN_TOGGLE,
                name: fullScreen ? 'exit' : 'enter'
              });
              setFullScreen((prev) => !prev);
            }}
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
              {zoom > 9 && lieuxSlot}
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
                      onClick={() => {
                        trackEvent({
                          category: MatomoCategory.MAP,
                          action: MatomoAction.LAYER_TOGGLE,
                          name: fragiliteNumeriqueLayer ? 'hide' : 'show'
                        });
                        setFragiliteNumeriqueLayer((prev) => !prev);
                      }}
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
