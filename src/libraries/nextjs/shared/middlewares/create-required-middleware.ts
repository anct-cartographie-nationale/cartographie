export const createRequiredMiddleware =
  (onFail: () => never) =>
  <TKeys extends string[]>(...keys: TKeys) =>
  async <TCtx extends { [K in TKeys[number]]?: unknown }>(
    ctx: TCtx
  ): Promise<{ ctx: { [K in TKeys[number]]: NonNullable<TCtx[K & keyof TCtx]> } }> => {
    for (const key of keys) {
      if (ctx[key as keyof TCtx] == null) onFail();
    }
    return { ctx: ctx as { [K in TKeys[number]]: NonNullable<TCtx[K & keyof TCtx]> } };
  };
