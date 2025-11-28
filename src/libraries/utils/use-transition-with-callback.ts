'use client';

import { useEffect, useRef, useTransition } from 'react';

export const useTransitionWithCallback = (callback: () => void) => {
  const [isPending, startTransition] = useTransition();
  const previousPending = useRef(isPending);

  useEffect(() => {
    if (previousPending.current && !isPending) {
      callback();
    }
    previousPending.current = isPending;
  }, [isPending, callback]);

  return [isPending, startTransition] as const;
};
