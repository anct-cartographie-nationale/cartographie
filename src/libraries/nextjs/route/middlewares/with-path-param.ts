import type { NextRequest } from 'next/server';

export function withPathParam<TKey extends string>(
  key: TKey,
  segmentIndex: number
): (ctx: object, request: NextRequest) => Promise<{ ctx: { [K in TKey]: string | undefined } }>;

export function withPathParam(key: string, segmentIndex: number) {
  return async (_ctx: object, request: NextRequest) => {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    return { ctx: { [key]: segments[segmentIndex] } };
  };
}
