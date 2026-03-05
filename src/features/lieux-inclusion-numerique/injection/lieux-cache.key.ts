import { key } from 'piqure';
import type { Lieu } from '../abilities/map-view/query/lieu';

export const LIEUX_CACHE = key<Map<string, Lieu[]>>('lieux-cache');
