import { inject, key, provide } from './container';

export const withInjectable = <TKey extends string, TContext, TResult>(
  name: TKey,
  keyName: string,
  importFactory: () => Promise<(ctx: TContext) => TResult>
) => {
  const KEY = key<(ctx: TContext) => TResult>(keyName);
  let factoryPromise: Promise<(ctx: TContext) => TResult> | null = null;

  const getFactory = async (): Promise<(ctx: TContext) => TResult> => {
    try {
      return inject(KEY);
    } catch {
      if (!factoryPromise) {
        factoryPromise = importFactory().then((factory) => {
          provide(KEY, factory);
          return factory;
        });
      }
      return factoryPromise;
    }
  };

  return async (ctx: TContext, _rawInput: unknown): Promise<{ ctx: { [K in TKey]: TResult } }> => {
    const factory = await getFactory();
    return { ctx: { [name]: factory(ctx) } as { [K in TKey]: TResult } };
  };
};
