import type { BBox } from 'geojson';

export type Position2D = [number, number];

export type MapChunkOptions = {
  verticalStep: number;
  horizontalStep: number;
};

const DEFAULT_MAP_CHUNK_OPTIONS: MapChunkOptions = { verticalStep: 0.1, horizontalStep: 0.1 };

const round = (value: number, precision: number = 1): number => Math.round(value * 10 ** precision) / 10 ** precision;

const ceil = (value: number, step: number): number => Math.ceil(value / step) * step;

const floor = (value: number, step: number): number => Math.floor(value / step) * step;

const chunkBounds =
  ({ verticalStep, horizontalStep }: MapChunkOptions) =>
  ([lon, lat]: Position2D): BBox => [
    floor(lon, horizontalStep),
    floor(lat, verticalStep),
    ceil(lon, horizontalStep),
    ceil(lat, verticalStep)
  ];

const maxLatFor =
  ({ verticalStep }: MapChunkOptions) =>
  ([_minLon, minLat, _maxLon, maxLat]: BBox): number =>
    round(maxLat === minLat ? maxLat + verticalStep : maxLat);

const minLonFor = ([minLon]: BBox): number => round(minLon);

const minLatFor = ([_minLon, minLat]: BBox): number => round(minLat);

const maxLonFor =
  ({ horizontalStep }: MapChunkOptions) =>
  ([minLon, _minLat, maxLon]: BBox): number =>
    round(minLon === maxLon ? maxLon + horizontalStep : maxLon);

export const mapChunk = (position: Position2D, mapChunkOptions: Partial<MapChunkOptions> = {}): BBox => {
  const options: MapChunkOptions = { ...DEFAULT_MAP_CHUNK_OPTIONS, ...mapChunkOptions };
  const bounds = chunkBounds(options)(position);

  return [minLonFor(bounds), minLatFor(bounds), maxLonFor(options)(bounds), maxLatFor(options)(bounds)];
};

export const boundingBoxCenter = ([minLon, minLat, maxLon, maxLat]: BBox): Position2D => [
  round((minLon + maxLon) / 2, 2),
  round((maxLat + minLat) / 2, 2)
];

export const splitBondingBox = (boundingBox: BBox, mapChunkOptions: Partial<MapChunkOptions> = {}): BBox[] => {
  const options: MapChunkOptions = { ...DEFAULT_MAP_CHUNK_OPTIONS, ...mapChunkOptions };
  const chunks: BBox[] = [];
  const minLon = floor(boundingBox[0], options.horizontalStep);
  const minLat = floor(boundingBox[1], options.verticalStep);
  const maxLon = ceil(boundingBox[2], options.horizontalStep);
  const maxLat = ceil(boundingBox[3], options.verticalStep);

  for (let lat = maxLat; lat > minLat - options.verticalStep; lat -= options.verticalStep) {
    for (let lon = minLon; lon < maxLon; lon += options.horizontalStep) {
      chunks.push([round(lon, 2), round(lat, 2), round(lon + options.horizontalStep, 2), round(lat + options.verticalStep, 2)]);
    }
  }

  return chunks;
};
