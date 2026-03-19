import type { ComponentType, ReactNode } from 'react';

export type Provider = {
  component: ComponentType<{ children: ReactNode } & Record<string, unknown>>;
  props: Record<string, unknown>;
};
