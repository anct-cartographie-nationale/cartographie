import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Merge, Provider } from '../shared/types';
import { applyProviders } from './apply-providers';
import type { PageProps } from './page-props';

type AnyMiddleware<TProps extends PageProps> = (
  ctx: Record<string, unknown>,
  props: TProps
) => Promise<{ ctx: Record<string, unknown>; provider?: Provider }>;

type MiddlewareEntry<TProps extends PageProps> = AnyMiddleware<TProps> | AnyMiddleware<TProps>[];

type MiddlewareAccumulator = {
  ctx: Record<string, unknown>;
  providers: Provider[];
};

type TypedMiddleware<TCtxIn extends object, TCtxOut extends object> = (
  ctx: TCtxIn,
  props: PageProps
) => Promise<{ ctx: TCtxOut; provider?: Provider }>;

interface PageBuilder<TCtx extends object> {
  use<O1 extends object>(m1: TypedMiddleware<TCtx, O1>): PageBuilder<Merge<TCtx, O1>>;

  use<O1 extends object, O2 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>
  ): PageBuilder<Merge<Merge<TCtx, O1>, O2>>;

  use<O1 extends object, O2 extends object, O3 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>
  ): PageBuilder<Merge<Merge<Merge<TCtx, O1>, O2>, O3>>;

  use<O1 extends object, O2 extends object, O3 extends object, O4 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>,
    m4: TypedMiddleware<TCtx, O4>
  ): PageBuilder<Merge<Merge<Merge<Merge<TCtx, O1>, O2>, O3>, O4>>;

  use<O1 extends object, O2 extends object, O3 extends object, O4 extends object, O5 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>,
    m4: TypedMiddleware<TCtx, O4>,
    m5: TypedMiddleware<TCtx, O5>
  ): PageBuilder<Merge<Merge<Merge<Merge<Merge<TCtx, O1>, O2>, O3>, O4>, O5>>;

  use<O1 extends object, O2 extends object, O3 extends object, O4 extends object, O5 extends object, O6 extends object>(
    m1: TypedMiddleware<TCtx, O1>,
    m2: TypedMiddleware<TCtx, O2>,
    m3: TypedMiddleware<TCtx, O3>,
    m4: TypedMiddleware<TCtx, O4>,
    m5: TypedMiddleware<TCtx, O5>,
    m6: TypedMiddleware<TCtx, O6>
  ): PageBuilder<Merge<Merge<Merge<Merge<Merge<Merge<TCtx, O1>, O2>, O3>, O4>, O5>, O6>>;

  render(handler: (ctx: TCtx, props: PageProps) => ReactNode | Promise<ReactNode>): (props: PageProps) => Promise<ReactNode>;

  redirectTo(getUrl: (ctx: TCtx) => string): (props: PageProps) => Promise<never>;
}

const executeParallel = async (
  middlewares: AnyMiddleware<PageProps>[],
  ctx: Record<string, unknown>,
  props: PageProps
): Promise<MiddlewareAccumulator> => {
  const results = await Promise.all(middlewares.map((middleware) => middleware(ctx, props)));
  return results.reduce<MiddlewareAccumulator>(
    (acc, result) => ({
      ctx: { ...acc.ctx, ...result.ctx },
      providers: result.provider ? [...acc.providers, result.provider] : acc.providers
    }),
    { ctx, providers: [] }
  );
};

const toResolvedMiddleware =
  (props: PageProps) =>
  async (accPromise: Promise<MiddlewareAccumulator>, entry: MiddlewareEntry<PageProps>): Promise<MiddlewareAccumulator> => {
    const acc = await accPromise;
    if (Array.isArray(entry)) {
      const parallelResult = await executeParallel(entry, acc.ctx, props);
      return {
        ctx: parallelResult.ctx,
        providers: [...acc.providers, ...parallelResult.providers]
      };
    }
    const result = await entry(acc.ctx, props);
    return {
      ctx: { ...acc.ctx, ...result.ctx },
      providers: result.provider ? [...acc.providers, result.provider] : acc.providers
    };
  };

const executeMiddlewares = (entries: MiddlewareEntry<PageProps>[], props: PageProps): Promise<MiddlewareAccumulator> =>
  entries.reduce(toResolvedMiddleware(props), Promise.resolve<MiddlewareAccumulator>({ ctx: {}, providers: [] }));

export const pageBuilder = (): PageBuilder<object> => {
  const createBuilder = <TCtx extends object>(entries: MiddlewareEntry<PageProps>[]): PageBuilder<TCtx> =>
    ({
      use: (...middlewares: AnyMiddleware<PageProps>[]) => {
        const [single] = middlewares;
        const entry: MiddlewareEntry<PageProps> = middlewares.length === 1 && single ? single : middlewares;
        return createBuilder([...entries, entry]);
      },

      render:
        (handler: (ctx: TCtx, props: PageProps) => ReactNode | Promise<ReactNode>) =>
        async (props: PageProps): Promise<ReactNode> => {
          const { ctx, providers } = await executeMiddlewares(entries, props);
          const content = await handler(ctx as TCtx, props);
          return applyProviders(providers, content);
        },

      redirectTo:
        (getUrl: (ctx: TCtx) => string) =>
        async (props: PageProps): Promise<never> => {
          const { ctx } = await executeMiddlewares(entries, props);
          redirect(getUrl(ctx as TCtx));
        }
    }) as PageBuilder<TCtx>;

  return createBuilder<object>([]);
};

export type { PageBuilder };
