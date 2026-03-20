import type { ReactNode } from 'react';
import { applyProviders, type Provider } from '../page/apply-providers';
import type { Pipeline } from '../shared/types';
import type { LayoutProps } from './types';

type AnyMiddleware = (
  ctx: Record<string, unknown>,
  props: LayoutProps
) => Promise<{ ctx: Record<string, unknown>; provider?: Provider }>;

type MiddlewareEntry = AnyMiddleware | AnyMiddleware[];

type AccumulatedResult = {
  ctx: Record<string, unknown>;
  providers: (Provider | undefined)[];
};

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

export const renderLayout =
  <TCtx extends object>(pipeline: Pipeline<TCtx, LayoutProps, 'layout'>) =>
  (handler: (ctx: TCtx, children: ReactNode) => ReactNode | Promise<ReactNode>): ((props: LayoutProps) => Promise<ReactNode>) =>
  async (props: LayoutProps): Promise<ReactNode> => {
    const { ctx, providers } = await (pipeline.middlewares as unknown as MiddlewareEntry[]).reduce(
      toResolvedMiddleware(props),
      Promise.resolve<AccumulatedResult>({ ctx: {}, providers: [] })
    );
    const content = await handler(ctx as TCtx, props.children);
    return applyProviders(providers, content);
  };
