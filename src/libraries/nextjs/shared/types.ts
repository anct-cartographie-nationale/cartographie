import type { ComponentType, ReactNode } from 'react';

export type Provider = {
  component: ComponentType<{ children: ReactNode } & Record<string, unknown>>;
  props: Record<string, unknown>;
};

export type Merge<A extends object, B extends object> = Omit<A, keyof B> & B;
