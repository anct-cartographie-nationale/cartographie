'use client';

import { Map as MapLibre } from 'react-map-gl/maplibre';
import france from '@/features/collectivites-territoriales/france.json';

const config = france.find(({ nom }) => nom === 'France métropolitaine');

export const Cartographie = () => (
  <MapLibre
    initialViewState={config ? { ...config.localisation, zoom: config.zoom } : {}}
    style={{ width: '100%', height: '100vh' }}
    mapStyle='./map/style.json'
  />
);
