import type { ComponentType, ReactNode } from 'react';

export type Provider = {
  component: ComponentType<{ children: ReactNode } & Record<string, unknown>>;
  props: Record<string, unknown>;
};

export type Pipeline<TCtx extends object, TExtra, TFinalizer extends string> = {
  readonly _ctx: TCtx;
  readonly _extra: TExtra;
  readonly _finalizer: TFinalizer;
  readonly middlewares: unknown[];
};
