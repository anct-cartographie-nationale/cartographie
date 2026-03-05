import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { handleServerActionError } from './handle-server-action-error';
import type { ServerActionResult } from './server-action-result';

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type ActionMiddleware<TContextIn extends object, TContextOut extends object> = (
  ctx: TContextIn,
  rawInput: unknown
) => Promise<{ ctx: TContextOut }>;

type AnyMiddleware = ActionMiddleware<object, object>;

type MiddlewareEntry = AnyMiddleware | AnyMiddleware[];

type ActionBuilder<TContext extends object> = {
  with: <TContextOut extends object>(
    middleware: ActionMiddleware<TContext, TContextOut>
  ) => ActionBuilder<TContext & TContextOut>;

  withAll: <TContextOuts extends object[]>(
    ...middlewares: { [K in keyof TContextOuts]: ActionMiddleware<TContext, TContextOuts[K]> }
  ) => ActionBuilder<TContext & UnionToIntersection<TContextOuts[number]>>;

  mutation: <TResult = void>(
    handler: (params: { ctx: TContext }) => Promise<ServerActionResult<TResult>>
  ) => (input?: unknown) => Promise<ServerActionResult<TResult>>;

  query: <TResult>(
    handler: (params: { ctx: TContext }) => Promise<ServerActionResult<TResult>>
  ) => (input?: unknown) => Promise<ServerActionResult<TResult>>;
};

const executeParallel = async (
  middlewares: AnyMiddleware[],
  ctx: Record<string, unknown>,
  rawInput: unknown
): Promise<Record<string, unknown>> => {
  const results = await Promise.all(middlewares.map((middleware) => middleware(ctx, rawInput)));
  return results.reduce((acc, result) => Object.assign(acc, result.ctx), { ...ctx });
};

const toResolvedMiddleware =
  (rawInput: unknown) =>
  async (accPromise: Promise<Record<string, unknown>>, entry: MiddlewareEntry): Promise<Record<string, unknown>> => {
    const ctx = await accPromise;

    if (Array.isArray(entry)) {
      return executeParallel(entry, ctx, rawInput);
    }

    const result = await entry(ctx, rawInput);
    return { ...ctx, ...result.ctx };
  };

const executeMiddlewares = (middlewares: MiddlewareEntry[], rawInput: unknown): Promise<Record<string, unknown>> =>
  middlewares.reduce(toResolvedMiddleware(rawInput), Promise.resolve({}));

const executeHandler = async <TContext extends object, TResult>(
  ctx: TContext,
  handler: (params: { ctx: TContext }) => Promise<ServerActionResult<TResult>>
): Promise<ServerActionResult<TResult>> => {
  try {
    return await handler({ ctx });
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error;
    return handleServerActionError(error);
  }
};

const createActionBuilder = <TContext extends object>(middlewares: MiddlewareEntry[]): ActionBuilder<TContext> => ({
  with: <TContextOut extends object>(middleware: ActionMiddleware<TContext, TContextOut>) =>
    createActionBuilder<TContext & TContextOut>([...middlewares, middleware as unknown as AnyMiddleware]),

  withAll: <TContextOuts extends object[]>(
    ...parallelMiddlewares: { [K in keyof TContextOuts]: ActionMiddleware<TContext, TContextOuts[K]> }
  ) =>
    createActionBuilder<TContext & UnionToIntersection<TContextOuts[number]>>([
      ...middlewares,
      parallelMiddlewares as unknown as AnyMiddleware[]
    ]),

  mutation:
    <TResult = void>(handler: (params: { ctx: TContext }) => Promise<ServerActionResult<TResult>>) =>
    async (rawInput?: unknown): Promise<ServerActionResult<TResult>> => {
      try {
        const ctx = (await executeMiddlewares(middlewares, rawInput)) as TContext;
        return executeHandler(ctx, handler);
      } catch (error: unknown) {
        if (isRedirectError(error)) throw error;
        return handleServerActionError(error);
      }
    },

  query:
    <TResult>(handler: (params: { ctx: TContext }) => Promise<ServerActionResult<TResult>>) =>
    async (rawInput?: unknown): Promise<ServerActionResult<TResult>> => {
      try {
        const ctx = (await executeMiddlewares(middlewares, rawInput)) as TContext;
        return executeHandler(ctx, handler);
      } catch (error: unknown) {
        if (isRedirectError(error)) throw error;
        return handleServerActionError(error);
      }
    }
});

export const serverAction = createActionBuilder<object>([]);

export type { ActionMiddleware, ActionBuilder };
