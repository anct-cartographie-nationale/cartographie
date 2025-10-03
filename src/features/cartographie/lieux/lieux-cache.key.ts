import { key } from 'piqure';
import type { Lieu } from './domain/lieu';

export const LIEUX_CACHE = key<Map<string, Lieu[]>>('lieux-cache');
