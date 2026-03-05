import type { Position2D } from '@/libraries/map';
import type { Lieu } from './lieu';

export type LieuxForChunk = ([longitude, latitude]: Position2D, searchParams: URLSearchParams) => Promise<Lieu[]>;
