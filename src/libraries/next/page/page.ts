import type { ReactNode } from 'react';
import { applyProviders, type Provider } from './apply-providers';

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type PageProps<
  TParams extends Record<string, string> = Record<string, string>,
  TSearchParams extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>
> = {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
};

type MiddlewareResult<TContext extends object> = {
  ctx: TContext;
  provider?: Provider;
};

type PageMiddleware<TContextIn extends object, TContextOut extends object, TProps extends PageProps = PageProps> = (
  ctx: TContextIn,
  props: TProps
) => Promise<MiddlewareResult<TContextOut>>;

type AnyMiddleware = PageMiddleware<object, object, PageProps>;

type MiddlewareEntry = AnyMiddleware | AnyMiddleware[];

type AccumulatedResult = {
  ctx: Record<string, unknown>;
  providers: (Provider | undefined)[];
};

type PageBuilder<TContext extends object, TProps extends PageProps = PageProps> = {
  with: <TContextOut extends object>(
    middleware: PageMiddleware<TContext, TContextOut, TProps>
  ) => PageBuilder<TContext & TContextOut, TProps>;

  withAll: <TContextOuts extends object[]>(
    ...middlewares: { [K in keyof TContextOuts]: PageMiddleware<TContext, TContextOuts[K], TProps> }
  ) => PageBuilder<TContext & UnionToIntersection<TContextOuts[number]>, TProps>;

  render: (fn: (ctx: TContext, props: TProps) => ReactNode | Promise<ReactNode>) => (props: TProps) => Promise<ReactNode>;
};

const executeParallel = async (
  middlewares: AnyMiddleware[],
  ctx: Record<string, unknown>,
  props: PageProps
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
  (props: PageProps) =>
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

const executeMiddlewares = (middlewares: MiddlewareEntry[], props: PageProps): Promise<AccumulatedResult> =>
  middlewares.reduce(toResolvedMiddleware(props), Promise.resolve({ ctx: {}, providers: [] }));

const createPageBuilder = <TContext extends object, TProps extends PageProps = PageProps>(
  middlewares: MiddlewareEntry[]
): PageBuilder<TContext, TProps> => ({
  with: <TContextOut extends object>(middleware: PageMiddleware<TContext, TContextOut, TProps>) =>
    createPageBuilder<TContext & TContextOut, TProps>([...middlewares, middleware as unknown as AnyMiddleware]),

  withAll: <TContextOuts extends object[]>(
    ...parallelMiddlewares: { [K in keyof TContextOuts]: PageMiddleware<TContext, TContextOuts[K], TProps> }
  ) =>
    createPageBuilder<TContext & UnionToIntersection<TContextOuts[number]>, TProps>([
      ...middlewares,
      parallelMiddlewares as unknown as AnyMiddleware[]
    ]),

  render:
    (fn: (ctx: TContext, props: TProps) => ReactNode | Promise<ReactNode>) =>
    async (props: TProps): Promise<ReactNode> => {
      const { ctx, providers } = await executeMiddlewares(middlewares, props as unknown as PageProps);
      const content = await fn(ctx as TContext, props);
      return applyProviders(providers, content);
    }
});

export const page = createPageBuilder<object>([]);

export type { PageMiddleware, PageBuilder, Provider };
