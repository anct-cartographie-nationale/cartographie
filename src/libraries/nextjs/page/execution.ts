import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Pipeline, Provider } from '../shared/types';
import { applyProviders } from './apply-providers';
import type { MiddlewareAccumulator } from './types';

type AnyMiddleware<TExtra> = (
  ctx: Record<string, unknown>,
  extra: TExtra
) => Promise<{ ctx: Record<string, unknown>; provider?: Provider }>;

type MiddlewareEntry<TExtra> = AnyMiddleware<TExtra> | AnyMiddleware<TExtra>[];

type AnyPageWrapperMiddleware = (ctx: Record<string, unknown>, next: () => Promise<ReactNode>) => Promise<ReactNode>;

const executeParallel = async <TExtra>(
  middlewares: AnyMiddleware<TExtra>[],
  ctx: Record<string, unknown>,
  extra: TExtra
): Promise<MiddlewareAccumulator> => {
  const results = await Promise.all(middlewares.map((middleware) => middleware(ctx, extra)));
  return results.reduce<MiddlewareAccumulator>(
    (acc, result) => ({
      ctx: { ...acc.ctx, ...result.ctx },
      providers: result.provider ? [...acc.providers, result.provider] : acc.providers
    }),
    { ctx, providers: [] }
  );
};

const toResolvedMiddleware =
  <TExtra>(extra: TExtra) =>
  async (accPromise: Promise<MiddlewareAccumulator>, entry: MiddlewareEntry<TExtra>): Promise<MiddlewareAccumulator> => {
    const acc = await accPromise;
    if (Array.isArray(entry)) {
      const parallelResult = await executeParallel(entry, acc.ctx, extra);
      return {
        ctx: parallelResult.ctx,
        providers: [...acc.providers, ...parallelResult.providers]
      };
    }
    const result = await entry(acc.ctx, extra);
    return {
      ctx: { ...acc.ctx, ...result.ctx },
      providers: result.provider ? [...acc.providers, result.provider] : acc.providers
    };
  };

const applyWrappers = <TCtx extends object>(
  wrappers: AnyPageWrapperMiddleware[],
  ctx: TCtx,
  handler: () => Promise<ReactNode>
): Promise<ReactNode> =>
  wrappers.reduceRight<() => Promise<ReactNode>>(
    (next, wrapper) => () => wrapper(ctx as Record<string, unknown>, next),
    handler
  )();

const getWrappers = <TCtx extends object, TExtra, TFin extends string>(
  pipeline: Pipeline<TCtx, TExtra, TFin>
): AnyPageWrapperMiddleware[] =>
  'wrappers' in pipeline ? (pipeline as { wrappers: AnyPageWrapperMiddleware[] }).wrappers : [];

export const render =
  <TCtx extends object, TExtra, TFin extends string>(pipeline: Pipeline<TCtx, TExtra, TFin>) =>
  (handler: (ctx: TCtx, extra: TExtra) => Promise<ReactNode>): ((extra: TExtra) => Promise<ReactNode>) =>
  async (extra: TExtra) => {
    const { ctx, providers } = await (pipeline.middlewares as unknown as MiddlewareEntry<TExtra>[]).reduce(
      toResolvedMiddleware(extra),
      Promise.resolve<MiddlewareAccumulator>({ ctx: {}, providers: [] })
    );
    const content = await applyWrappers(getWrappers(pipeline), ctx as TCtx, () => handler(ctx as TCtx, extra));
    return applyProviders(providers, content);
  };

export const redirectTo =
  <TCtx extends object, TExtra, TFin extends string>(pipeline: Pipeline<TCtx, TExtra, TFin>) =>
  (getUrl: (ctx: TCtx) => string): ((extra: TExtra) => Promise<never>) =>
  async (extra: TExtra) => {
    const { ctx } = await (pipeline.middlewares as unknown as MiddlewareEntry<TExtra>[]).reduce(
      toResolvedMiddleware(extra),
      Promise.resolve<MiddlewareAccumulator>({ ctx: {}, providers: [] })
    );
    redirect(getUrl(ctx as TCtx));
  };
