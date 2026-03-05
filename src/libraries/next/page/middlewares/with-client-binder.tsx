'use client';

import type { InjectionKey } from 'piqure/src/Providing';
import { type ReactNode, useEffect, useRef } from 'react';
import { provideLazy } from '@/libraries/injection';
import type { Provider } from '../apply-providers';

type ClientBinderProps<TBind, TTo extends TBind> = {
  bind: InjectionKey<TBind>;
  to: TTo;
  children: ReactNode;
};

export const ClientBinder = <TBind, TTo extends TBind>({ bind, to, children }: ClientBinderProps<TBind, TTo>): ReactNode => {
  const hasProvided = useRef(false);

  if (!hasProvided.current) {
    provideLazy(bind, () => to);
    hasProvided.current = true;
  }

  useEffect(() => {
    provideLazy(bind, () => to);
  }, [bind, to]);

  return children;
};

export const withClientBinder =
  <TBind, TTo extends TBind>(bind: InjectionKey<TBind>, to: TTo) =>
  async (): Promise<{ ctx: object; provider: Provider }> => ({
    ctx: {},
    provider: {
      component: ClientBinder as Provider['component'],
      props: { bind, to }
    }
  });
