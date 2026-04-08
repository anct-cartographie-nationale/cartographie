import type { Lieu } from './lieu';

const MAX_CACHE_SIZE = 100;

export const lieuxCache = new Map<string, Lieu[]>();

export const ensureCacheLimit = (cache: Map<string, Lieu[]>): void => {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
};

export const touchCache = (cache: Map<string, Lieu[]>, key: string): Lieu[] | undefined => {
  const value = cache.get(key);
  if (value !== undefined) {
    cache.delete(key);
    cache.set(key, value);
  }
  return value;
};
