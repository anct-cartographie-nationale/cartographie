import { NextResponse } from 'next/server';

export const withRequired =
  <TKeys extends string[]>(...keys: TKeys) =>
  async <TCtx extends { [K in TKeys[number]]?: unknown }>(
    ctx: TCtx
  ): Promise<{ ctx: { [K in TKeys[number]]: NonNullable<TCtx[K & keyof TCtx]> } } | NextResponse> => {
    for (const key of keys) {
      if (ctx[key as keyof TCtx] == null) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
    }
    return { ctx: ctx as { [K in TKeys[number]]: NonNullable<TCtx[K & keyof TCtx]> } };
  };
