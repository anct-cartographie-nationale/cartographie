export function withMap<TKey extends string, TIn, TOut>(
  key: TKey,
  mapper: (value: TIn) => TOut
): (ctx: Record<string, unknown>, extra: unknown) => Promise<{ ctx: { [K in TKey]: TOut } }>;

export function withMap(key: string, mapper: (value: unknown) => unknown) {
  return async (ctx: Record<string, unknown>, _extra: unknown) => ({
    ctx: { [key]: mapper(ctx[key]) }
  });
}
