import { key } from 'piqure';
import type { Position2D } from '@/libraries/map';
import type { Lieu } from '../abilities/map-view/query/lieu';

export type LieuxForChunk = ([longitude, latitude]: Position2D, searchParams: URLSearchParams) => Promise<Lieu[]>;

export const LIEUX_FOR_CHUNK = key<LieuxForChunk>('lieux-for-chunk');
