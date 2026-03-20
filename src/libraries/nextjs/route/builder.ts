import type { NextRequest } from 'next/server';
import type { AnyMiddleware, RoutePipeline, TypedMiddleware, UseRoute } from './types';

type InitialRouteContext = { params: Record<string, string> };

export const fromRoute: RoutePipeline<InitialRouteContext> = {
  _ctx: {} as InitialRouteContext,
  _extra: {} as NextRequest,
  _finalizer: 'route',
  middlewares: []
};

export const use = <TCtxIn extends object>(pipeline: RoutePipeline<TCtxIn>): UseRoute<TCtxIn> =>
  ((...middlewares: TypedMiddleware<TCtxIn, object>[]) => ({
    ...pipeline,
    middlewares: [...pipeline.middlewares, middlewares as unknown as AnyMiddleware[]]
  })) as UseRoute<TCtxIn>;
