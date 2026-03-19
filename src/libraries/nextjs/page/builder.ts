import type { AnyPageWrapperMiddleware, PagePipeline, PageProps, PageWrapperMiddleware } from './types';

export type Pipeline<TCtx extends object, TExtra, TFinalizer extends string> = {
  readonly _ctx: TCtx;
  readonly _extra: TExtra;
  readonly _finalizer: TFinalizer;
  readonly middlewares: MiddlewareEntry<TExtra>[];
};

type AnyMiddleware<TExtra> = (
  ctx: Record<string, unknown>,
  extra: TExtra
) => Promise<{ ctx: Record<string, unknown>; provider?: unknown }>;

type MiddlewareEntry<TExtra> = AnyMiddleware<TExtra> | AnyMiddleware<TExtra>[];

type TypedMiddleware<TCtxIn extends object, TCtxOut extends object, TExtra> = (
  ctx: TCtxIn,
  extra: TExtra
) => Promise<{ ctx: TCtxOut; provider?: unknown }>;

// Merge type that allows overriding existing keys (like object spread)
type Merge<A extends object, B extends object> = Omit<A, keyof B> & B;

type Use<TCtxIn extends object, TExtra, TFin extends string> = {
  <O1 extends object>(m1: TypedMiddleware<TCtxIn, O1, TExtra>): Pipeline<Merge<TCtxIn, O1>, TExtra, TFin>;

  <O1 extends object, O2 extends object>(
    m1: TypedMiddleware<TCtxIn, O1, TExtra>,
    m2: TypedMiddleware<TCtxIn, O2, TExtra>
  ): Pipeline<Merge<Merge<TCtxIn, O1>, O2>, TExtra, TFin>;

  <O1 extends object, O2 extends object, O3 extends object>(
    m1: TypedMiddleware<TCtxIn, O1, TExtra>,
    m2: TypedMiddleware<TCtxIn, O2, TExtra>,
    m3: TypedMiddleware<TCtxIn, O3, TExtra>
  ): Pipeline<Merge<Merge<Merge<TCtxIn, O1>, O2>, O3>, TExtra, TFin>;

  <O1 extends object, O2 extends object, O3 extends object, O4 extends object>(
    m1: TypedMiddleware<TCtxIn, O1, TExtra>,
    m2: TypedMiddleware<TCtxIn, O2, TExtra>,
    m3: TypedMiddleware<TCtxIn, O3, TExtra>,
    m4: TypedMiddleware<TCtxIn, O4, TExtra>
  ): Pipeline<Merge<Merge<Merge<Merge<TCtxIn, O1>, O2>, O3>, O4>, TExtra, TFin>;

  <O1 extends object, O2 extends object, O3 extends object, O4 extends object, O5 extends object>(
    m1: TypedMiddleware<TCtxIn, O1, TExtra>,
    m2: TypedMiddleware<TCtxIn, O2, TExtra>,
    m3: TypedMiddleware<TCtxIn, O3, TExtra>,
    m4: TypedMiddleware<TCtxIn, O4, TExtra>,
    m5: TypedMiddleware<TCtxIn, O5, TExtra>
  ): Pipeline<Merge<Merge<Merge<Merge<Merge<TCtxIn, O1>, O2>, O3>, O4>, O5>, TExtra, TFin>;

  <O1 extends object, O2 extends object, O3 extends object, O4 extends object, O5 extends object, O6 extends object>(
    m1: TypedMiddleware<TCtxIn, O1, TExtra>,
    m2: TypedMiddleware<TCtxIn, O2, TExtra>,
    m3: TypedMiddleware<TCtxIn, O3, TExtra>,
    m4: TypedMiddleware<TCtxIn, O4, TExtra>,
    m5: TypedMiddleware<TCtxIn, O5, TExtra>,
    m6: TypedMiddleware<TCtxIn, O6, TExtra>
  ): Pipeline<Merge<Merge<Merge<Merge<Merge<Merge<TCtxIn, O1>, O2>, O3>, O4>, O5>, O6>, TExtra, TFin>;
};

export const fromPage: Pipeline<object, PageProps, 'page'> = {
  _ctx: {} as object,
  _extra: {} as PageProps,
  _finalizer: 'page',
  middlewares: []
};

export const use = <TCtxIn extends object, TExtra, TFin extends string>(
  pipeline: Pipeline<TCtxIn, TExtra, TFin>
): Use<TCtxIn, TExtra, TFin> =>
  ((...middlewares: TypedMiddleware<TCtxIn, object, TExtra>[]) => ({
    ...pipeline,
    middlewares: [...pipeline.middlewares, middlewares as AnyMiddleware<TExtra>[]]
  })) as Use<TCtxIn, TExtra, TFin>;

export const wrap =
  <TCtx extends object, TProps extends PageProps>(pipeline: PagePipeline<TCtx, TProps>) =>
  (wrapper: PageWrapperMiddleware<TCtx>): PagePipeline<TCtx, TProps> => ({
    ...pipeline,
    wrappers: [...pipeline.wrappers, wrapper as AnyPageWrapperMiddleware]
  });
