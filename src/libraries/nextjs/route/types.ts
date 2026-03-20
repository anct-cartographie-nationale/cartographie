import type { NextRequest, NextResponse } from 'next/server';
import type { Pipeline } from '../shared/types';

export type RouteContext = {
  params: Promise<Record<string, string>>;
};

export type AnyMiddleware = (
  ctx: Record<string, unknown>,
  request: NextRequest
) => Promise<{ ctx: Record<string, unknown> } | NextResponse>;

export type MiddlewareEntry = AnyMiddleware | AnyMiddleware[];

export type TypedMiddleware<TCtxIn extends object, TCtxOut extends object> = (
  ctx: TCtxIn,
  request: NextRequest
) => Promise<{ ctx: TCtxOut } | NextResponse>;

export type RoutePipeline<TCtx extends object> = Pipeline<TCtx, NextRequest, 'route'>;

// Merge type that allows overriding existing keys (like object spread)
type Merge<A extends object, B extends object> = Omit<A, keyof B> & B;

export type UseRoute<TCtxIn extends object> = {
  <O1 extends object>(m1: TypedMiddleware<TCtxIn, O1>): RoutePipeline<Merge<TCtxIn, O1>>;

  <O1 extends object, O2 extends object>(
    m1: TypedMiddleware<TCtxIn, O1>,
    m2: TypedMiddleware<TCtxIn, O2>
  ): RoutePipeline<Merge<Merge<TCtxIn, O1>, O2>>;

  <O1 extends object, O2 extends object, O3 extends object>(
    m1: TypedMiddleware<TCtxIn, O1>,
    m2: TypedMiddleware<TCtxIn, O2>,
    m3: TypedMiddleware<TCtxIn, O3>
  ): RoutePipeline<Merge<Merge<Merge<TCtxIn, O1>, O2>, O3>>;

  <O1 extends object, O2 extends object, O3 extends object, O4 extends object>(
    m1: TypedMiddleware<TCtxIn, O1>,
    m2: TypedMiddleware<TCtxIn, O2>,
    m3: TypedMiddleware<TCtxIn, O3>,
    m4: TypedMiddleware<TCtxIn, O4>
  ): RoutePipeline<Merge<Merge<Merge<Merge<TCtxIn, O1>, O2>, O3>, O4>>;

  <O1 extends object, O2 extends object, O3 extends object, O4 extends object, O5 extends object>(
    m1: TypedMiddleware<TCtxIn, O1>,
    m2: TypedMiddleware<TCtxIn, O2>,
    m3: TypedMiddleware<TCtxIn, O3>,
    m4: TypedMiddleware<TCtxIn, O4>,
    m5: TypedMiddleware<TCtxIn, O5>
  ): RoutePipeline<Merge<Merge<Merge<Merge<Merge<TCtxIn, O1>, O2>, O3>, O4>, O5>>;

  <O1 extends object, O2 extends object, O3 extends object, O4 extends object, O5 extends object, O6 extends object>(
    m1: TypedMiddleware<TCtxIn, O1>,
    m2: TypedMiddleware<TCtxIn, O2>,
    m3: TypedMiddleware<TCtxIn, O3>,
    m4: TypedMiddleware<TCtxIn, O4>,
    m5: TypedMiddleware<TCtxIn, O5>,
    m6: TypedMiddleware<TCtxIn, O6>
  ): RoutePipeline<Merge<Merge<Merge<Merge<Merge<Merge<TCtxIn, O1>, O2>, O3>, O4>, O5>, O6>>;
};
