import type { ReactNode } from 'react';
import { applyProviders } from '../page/apply-providers';
import type { Merge, Provider } from '../shared/types';

type LayoutProps = { children: ReactNode };

type AnyMiddleware = (
  ctx: Record<string, unknown>,
  props: LayoutProps
) => Promise<{ ctx: Record<string, unknown>; provider?: Provider }>;

type TypedMiddleware<TCtxIn extends object, TCtxOut extends object> = (
  ctx: TCtxIn,
  props: LayoutProps
) => Promise<{ ctx: TCtxOut; provider?: Provider }>;

type MiddlewareEntry = AnyMiddleware | AnyMiddleware[];

type AccumulatedResult = {
  ctx: Record<string, unknown>;
  providers: (Provider | undefined)[];
};

interface LayoutBuilder<TCtx extends object> {
  use<O1 extends object>(m1: TypedMiddleware<TCtx, O1>): LayoutBuilder<Merge<TCtx, O1>>;

  use<O1 extends object, O2 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>
  ): LayoutBuilder<Merge<Merge<TCtx, O1>, O2>>;

  use<O1 extends object, O2 extends object, O3 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>
  ): LayoutBuilder<Merge<Merge<Merge<TCtx, O1>, O2>, O3>>;

  use<O1 extends object, O2 extends object, O3 extends object, O4 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>,
    m4: TypedMiddleware<TCtx, O4>
  ): LayoutBuilder<Merge<Merge<Merge<Merge<TCtx, O1>, O2>, O3>, O4>>;

  render(
    handler: (ctx: TCtx, children: ReactNode) => ReactNode | Promise<ReactNode>
  ): (props: LayoutProps) => Promise<ReactNode>;
}

const executeParallel = async (
  middlewares: AnyMiddleware[],
  ctx: Record<string, unknown>,
  props: LayoutProps
): Promise<AccumulatedResult> => {
  const results = await Promise.all(middlewares.map((middleware) => middleware(ctx, props)));
  return results.reduce<AccumulatedResult>(
    (acc, result) => ({
      ctx: { ...acc.ctx, ...result.ctx },
      providers: [...acc.providers, result.provider]
    }),
    { ctx: { ...ctx }, providers: [] }
  );
};

const toResolvedMiddleware =
  (props: LayoutProps) =>
  async (accPromise: Promise<AccumulatedResult>, entry: MiddlewareEntry): Promise<AccumulatedResult> => {
    const acc = await accPromise;

    if (Array.isArray(entry)) {
      const parallelResult = await executeParallel(entry, acc.ctx, props);
      return {
        ctx: { ...acc.ctx, ...parallelResult.ctx },
        providers: [...acc.providers, ...parallelResult.providers]
      };
    }

    const result = await entry(acc.ctx, props);
    return {
      ctx: { ...acc.ctx, ...result.ctx },
      providers: [...acc.providers, result.provider]
    };
  };

const executeMiddlewares = (entries: MiddlewareEntry[], props: LayoutProps): Promise<AccumulatedResult> =>
  entries.reduce(toResolvedMiddleware(props), Promise.resolve<AccumulatedResult>({ ctx: {}, providers: [] }));

export const layoutBuilder = (): LayoutBuilder<object> => {
  const createBuilder = <TCtx extends object>(entries: MiddlewareEntry[]): LayoutBuilder<TCtx> =>
    ({
      use: (...middlewares: AnyMiddleware[]) => {
        const [single] = middlewares;
        const entry: MiddlewareEntry = middlewares.length === 1 && single ? single : middlewares;
        return createBuilder([...entries, entry]);
      },

      render:
        (handler: (ctx: TCtx, children: ReactNode) => ReactNode | Promise<ReactNode>) =>
        async (props: LayoutProps): Promise<ReactNode> => {
          const { ctx, providers } = await executeMiddlewares(entries, props);
          const content = await handler(ctx as TCtx, props.children);
          return applyProviders(providers, content);
        }
    }) as LayoutBuilder<TCtx>;

  return createBuilder<object>([]);
};

export type { LayoutBuilder };
