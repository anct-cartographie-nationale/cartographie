'use client';

import { mapStyles } from 'carte-facile';
import { Map as MapLibre } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import france from '@/features/collectivites-territoriales/france.json';
import { cn } from '@/libraries/utils';
import { ClientOnly } from '@/libraries/utils/client-only';

const config = france.find(({ nom }) => nom === 'France métropolitaine');

export const Cartographie = () => {
  const { theme } = useTheme();

  return (
    <ClientOnly>
      <div className={cn('w-full h-full', theme === 'dark' && 'invert-90')}>
        <MapLibre
          initialViewState={config ? { ...config.localisation, zoom: config.zoom } : {}}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyles.simple}
        />
      </div>
    </ClientOnly>
  );
};
