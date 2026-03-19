import type { ReactNode } from 'react';
import type { Pipeline, Provider } from '../shared/types';

export type PageProps<
  TParams extends Record<string, string> = Record<string, string>,
  TSearchParams extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>
> = {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
};

export type AnyMiddleware<TProps extends PageProps> = (
  ctx: Record<string, unknown>,
  props: TProps
) => Promise<{ ctx: Record<string, unknown>; provider?: Provider }>;

export type MiddlewareEntry<TProps extends PageProps> = AnyMiddleware<TProps> | AnyMiddleware<TProps>[];

export type TypedMiddleware<TCtxIn extends object, TCtxOut extends object, TProps extends PageProps> = (
  ctx: TCtxIn,
  props: TProps
) => Promise<{ ctx: TCtxOut; provider?: Provider }>;

export type PageWrapperMiddleware<TCtx extends object = object> = (
  ctx: TCtx,
  next: () => Promise<ReactNode>
) => Promise<ReactNode>;

export type AnyPageWrapperMiddleware = PageWrapperMiddleware<Record<string, unknown>>;

export type PagePipeline<TCtx extends object, TProps extends PageProps = PageProps> = Pipeline<TCtx, TProps, 'page'> & {
  wrappers: AnyPageWrapperMiddleware[];
};

export type MiddlewareAccumulator = {
  ctx: Record<string, unknown>;
  providers: Provider[];
};

export type PipelineOrPagePipeline<TCtx extends object, TProps extends PageProps> =
  | Pipeline<TCtx, TProps, 'page'>
  | PagePipeline<TCtx, TProps>;

export type { Provider };
