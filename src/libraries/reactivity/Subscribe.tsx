import { cloneElement, isValidElement, type ReactElement, type ReactNode, useEffect, useState } from 'react';
import type { Observable } from 'rxjs';

type SubscriptionResult<T> = [value: T | undefined, error: Error | undefined];

type SubscribeChildrenProps<T> = { value: T | undefined; error: Error | undefined };

type SubscribeChildren<T> = ReactElement<SubscribeChildrenProps<T>> | ((props: SubscribeChildrenProps<T>) => ReactNode);

export const useSubscribe = <T,>(to$: Observable<T>, startWith?: T): SubscriptionResult<T> => {
  const [value, setValue] = useState<T | undefined>(startWith);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const subscription = to$.subscribe({ next: setValue, error: setError });
    return () => subscription.unsubscribe();
  }, [to$]);

  return [value ?? undefined, error ?? undefined];
};

const renderChildren = <T,>(children: SubscribeChildren<T>, [value, error]: SubscriptionResult<T>) =>
  isValidElement(children) ? cloneElement(children, { value, error }) : children({ value, error });

export const Subscribe = <T,>({
  to$,
  startWith,
  children
}: {
  to$: Observable<T>;
  startWith?: T;
  children: SubscribeChildren<T>;
}) => renderChildren(children, useSubscribe(to$, startWith));
