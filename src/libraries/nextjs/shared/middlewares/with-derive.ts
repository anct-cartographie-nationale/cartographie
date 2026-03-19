export function withDerive<TKey extends string, TContext, TData>(
  key: TKey,
  derive: (ctx: TContext) => TData
): (ctx: TContext, extra: unknown) => Promise<{ ctx: { [K in TKey]: TData } }>;

export function withDerive(key: string, derive: (ctx: Record<string, unknown>) => unknown) {
  return async (ctx: Record<string, unknown>, _extra: unknown) => ({
    ctx: { [key]: derive(ctx) }
  });
}
