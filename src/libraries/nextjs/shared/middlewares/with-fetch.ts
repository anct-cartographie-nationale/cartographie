import { cached } from '../../cache';

type CacheOptions<TContext> = {
  cacheKey: (ctx: TContext) => unknown[];
  revalidate: number;
};

const withCache = async (
  cache: { cacheKey: (ctx: unknown) => unknown[]; revalidate: number },
  ctx: Record<string, unknown>,
  // biome-ignore lint/complexity/noBannedTypes: implementation signature needs generic callable
  fetcher: Function,
  key: string
) => {
  const cachedFetcher = cached(
    () => fetcher(ctx),
    cache.cacheKey(ctx).map((k) => (typeof k === 'string' ? k : JSON.stringify(k))),
    { revalidate: cache.revalidate }
  );
  return { ctx: { [key]: await cachedFetcher() } };
};

export function withFetch<TKey extends string, TContext, TData>(
  key: TKey,
  fetcher: (ctx: TContext) => Promise<TData>,
  options?: { cache?: CacheOptions<TContext> }
): (ctx: TContext, extra: unknown) => Promise<{ ctx: { [K in TKey]: TData } }>;

export function withFetch(
  key: string,
  // biome-ignore lint/complexity/noBannedTypes: implementation signature needs generic callable
  fetcher: Function,
  options?: { cache?: { cacheKey: (ctx: unknown) => unknown[]; revalidate: number } }
) {
  return async (ctx: Record<string, unknown>, _extra: unknown) =>
    options?.cache ? await withCache(options.cache, ctx, fetcher, key) : { ctx: { [key]: await fetcher(ctx) } };
}
