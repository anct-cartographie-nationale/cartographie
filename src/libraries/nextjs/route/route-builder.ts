import { type NextRequest, NextResponse } from 'next/server';
import type { Merge } from '../shared/types';

type RouteContext = {
  params: Promise<Record<string, string>>;
};

type AnyMiddleware = (
  ctx: Record<string, unknown>,
  request: NextRequest
) => Promise<{ ctx: Record<string, unknown> } | NextResponse>;

type MiddlewareEntry = AnyMiddleware | AnyMiddleware[];

type TypedMiddleware<TCtxIn extends object, TCtxOut extends object> = (
  ctx: TCtxIn,
  request: NextRequest
) => Promise<{ ctx: TCtxOut } | NextResponse>;

type InitialRouteContext = { params: Record<string, string> };

interface RouteBuilder<TCtx extends object> {
  use<O1 extends object>(m1: TypedMiddleware<TCtx, O1>): RouteBuilder<Merge<TCtx, O1>>;

  use<O1 extends object, O2 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>
  ): RouteBuilder<Merge<Merge<TCtx, O1>, O2>>;

  use<O1 extends object, O2 extends object, O3 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>
  ): RouteBuilder<Merge<Merge<Merge<TCtx, O1>, O2>, O3>>;

  use<O1 extends object, O2 extends object, O3 extends object, O4 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>,
    m4: TypedMiddleware<TCtx, O4>
  ): RouteBuilder<Merge<Merge<Merge<Merge<TCtx, O1>, O2>, O3>, O4>>;

  use<O1 extends object, O2 extends object, O3 extends object, O4 extends object, O5 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>,
    m4: TypedMiddleware<TCtx, O4>,
    m5: TypedMiddleware<TCtx, O5>
  ): RouteBuilder<Merge<Merge<Merge<Merge<Merge<TCtx, O1>, O2>, O3>, O4>, O5>>;

  use<O1 extends object, O2 extends object, O3 extends object, O4 extends object, O5 extends object, O6 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>,
    m4: TypedMiddleware<TCtx, O4>,
    m5: TypedMiddleware<TCtx, O5>,
    m6: TypedMiddleware<TCtx, O6>
  ): RouteBuilder<Merge<Merge<Merge<Merge<Merge<Merge<TCtx, O1>, O2>, O3>, O4>, O5>, O6>>;

  handle(
    handler: (ctx: TCtx & { request: NextRequest }) => Promise<Response>
  ): (request: NextRequest, context?: RouteContext) => Promise<Response>;
}

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
  entries: MiddlewareEntry[],
  initialCtx: Record<string, unknown>,
  request: NextRequest
): Promise<{ ctx: Record<string, unknown> } | NextResponse> => {
  let ctx: Record<string, unknown> = initialCtx;

  for (const entry of entries) {
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

export const routeBuilder = (): RouteBuilder<InitialRouteContext> => {
  const createBuilder = <TCtx extends object>(entries: MiddlewareEntry[]): RouteBuilder<TCtx> =>
    ({
      use: (...middlewares: AnyMiddleware[]) => {
        const [single] = middlewares;
        const entry: MiddlewareEntry = middlewares.length === 1 && single ? single : middlewares;
        return createBuilder([...entries, entry]);
      },

      handle:
        (handler: (ctx: TCtx & { request: NextRequest }) => Promise<Response>) =>
        async (request: NextRequest, context?: RouteContext): Promise<Response> => {
          const params = (await context?.params) ?? {};
          const result = await executeMiddlewares(entries, { params }, request);
          if (isResponse(result)) return result;
          return handler({ ...(result.ctx as TCtx), request });
        }
    }) as RouteBuilder<TCtx>;

  return createBuilder<InitialRouteContext>([]);
};

export type { RouteBuilder };
