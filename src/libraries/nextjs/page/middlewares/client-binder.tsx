'use client';

import type { InjectionKey } from 'piqure/src/Providing';
import { type ReactNode, useEffect, useRef } from 'react';
import { provideLazy } from '@/libraries/injection';

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
