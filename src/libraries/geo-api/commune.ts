import type { Point } from 'geojson';

export type GeoCommune = {
  code: string;
  nom: string;
  codeDepartement: string;
  population?: number;
  centre?: Point;
};
