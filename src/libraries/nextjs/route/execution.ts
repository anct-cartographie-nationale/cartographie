import { type NextRequest, NextResponse } from 'next/server';
import type { AnyMiddleware, MiddlewareEntry, RoutePipeline } from './types';

const isResponse = (result: { ctx: Record<string, unknown> } | NextResponse): result is NextResponse =>
  result instanceof NextResponse;

const executeParallel = async (
  middlewares: AnyMiddleware[],
  ctx: Record<string, unknown>,
  request: NextRequest
): Promise<{ ctx: Record<string, unknown> } | NextResponse> => {
  const results = await Promise.all(middlewares.map((middleware) => middleware(ctx, request)));

  for (const result of results) {
    if (isResponse(result)) return result;
  }

  return {
    ctx: results.reduce((acc, result) => ({ ...acc, ...(result as { ctx: Record<string, unknown> }).ctx }), { ...ctx })
  };
};

const executeMiddlewares = async (
  middlewares: MiddlewareEntry[],
  request: NextRequest
): Promise<{ ctx: Record<string, unknown> } | NextResponse> => {
  let ctx: Record<string, unknown> = {};

  for (const entry of middlewares) {
    if (Array.isArray(entry)) {
      const result = await executeParallel(entry, ctx, request);
      if (isResponse(result)) return result;
      ctx = result.ctx;
    } else {
      const result = await entry(ctx, request);
      if (isResponse(result)) return result;
      ctx = { ...ctx, ...result.ctx };
    }
  }

  return { ctx };
};

export const handle =
  <TCtx extends object>(pipeline: RoutePipeline<TCtx>) =>
  (handler: (ctx: TCtx & { request: NextRequest }) => Promise<Response>) =>
  async (request: NextRequest): Promise<Response> => {
    const result = await executeMiddlewares(pipeline.middlewares as MiddlewareEntry[], request);
    if (isResponse(result)) return result;
    return handler({ ...(result.ctx as TCtx), request });
  };
