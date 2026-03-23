import { notFound } from 'next/navigation';
import type { PageProps } from '../page-props';

type ExtractParams<TKeys extends string[]> = { [K in TKeys[number]]: string };

export const withParams =
  <TKeys extends string[]>(...keys: TKeys) =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: ExtractParams<TKeys> }> => {
    const params = await props.params;

    for (const key of keys) {
      if (params[key] === undefined) {
        notFound();
      }
    }

    const extracted = Object.fromEntries(keys.map((key) => [key, params[key]])) as ExtractParams<TKeys>;

    return { ctx: extracted };
  };
