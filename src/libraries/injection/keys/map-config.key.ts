import { key } from 'piqure';

export type MapConfig = {
  latitude?: number | undefined;
  longitude?: number | undefined;
  zoom?: number | undefined;
};

export const MAP_CONFIG = key<MapConfig>('map-config');
