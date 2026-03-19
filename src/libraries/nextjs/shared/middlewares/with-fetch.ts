export function withFetch<TKey extends string, TContext, TData>(
  key: TKey,
  fetcher: (ctx: TContext) => Promise<TData>
): (ctx: TContext, extra: unknown) => Promise<{ ctx: { [K in TKey]: TData } }>;

// biome-ignore lint/complexity/noBannedTypes: implementation signature needs generic callable
export function withFetch(key: string, fetcher: Function) {
  return async (ctx: Record<string, unknown>, _extra: unknown) => ({
    ctx: { [key]: await fetcher(ctx) }
  });
}
