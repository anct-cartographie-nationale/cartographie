import { type ReactNode, useEffect, useState } from 'react';
import type { Observable } from 'rxjs';

type SubscriptionResult<T> = [value: T | undefined, error: Error | undefined];

export const useSubscribe = <T,>(to$: Observable<T>, startWith?: T): SubscriptionResult<T> => {
  const [value, setValue] = useState<T | undefined>(startWith);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const subscription = to$.subscribe({ next: setValue, error: setError });
    return () => subscription.unsubscribe();
  }, [to$]);

  return [value ?? undefined, error ?? undefined];
};

export const Subscribe = <T,>({
  to$,
  startWith,
  fallback,
  onError,
  children
}: {
  to$: Observable<T>;
  startWith?: T;
  fallback?: ReactNode;
  onError?: (error: Error) => ReactNode;
  children: (value: T) => ReactNode;
}) => {
  const [value, error] = useSubscribe(to$, startWith);

  if (error) return onError?.(error) ?? null;

  return value === undefined ? (fallback ?? null) : children(value);
};
