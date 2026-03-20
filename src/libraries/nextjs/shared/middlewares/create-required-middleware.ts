export const createRequiredMiddleware =
  <TFail>(onFail: () => TFail) =>
  <TKeys extends string[]>(...keys: TKeys) =>
  async <TCtx extends { [K in TKeys[number]]?: unknown }>(
    ctx: TCtx
  ): Promise<{ ctx: { [K in TKeys[number]]: NonNullable<TCtx[K & keyof TCtx]> } } | TFail> => {
    for (const key of keys) {
      if (ctx[key as keyof TCtx] == null) return onFail();
    }
    return { ctx: ctx as { [K in TKeys[number]]: NonNullable<TCtx[K & keyof TCtx]> } };
  };
