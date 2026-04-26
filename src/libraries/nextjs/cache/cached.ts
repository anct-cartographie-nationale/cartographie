import { unstable_cache } from 'next/cache';

export const cached = <TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyParts: string[],
  options: { revalidate: number | false; tags?: string[] }
) => unstable_cache(fn, keyParts, { revalidate: options.revalidate, ...(options.tags ? { tags: options.tags } : {}) });
