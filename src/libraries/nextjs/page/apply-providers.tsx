import type { ComponentType, ReactNode } from 'react';

export type Provider = {
  component: ComponentType<{ children: ReactNode } & Record<string, unknown>>;
  props: Record<string, unknown>;
};

export const applyProviders = (providers: (Provider | undefined)[], content: ReactNode): ReactNode =>
  providers
    .filter((provider): provider is Provider => provider !== undefined)
    .reduceRight<ReactNode>(
      (children, { component: Component, props }) => (
        <Component key={Component.displayName ?? Component.name} {...props}>
          {children}
        </Component>
      ),
      content
    );
