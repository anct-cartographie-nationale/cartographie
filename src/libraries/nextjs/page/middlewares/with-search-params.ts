import type { z } from 'zod';
import type { PageProps } from '../types';

type SearchParamsProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Middleware to extract and optionally validate search params.
 *
 * @example Without validation (legacy)
 * ```ts
 * page.with(withSearchParams<MyType>())
 * ```
 *
 * @example With Zod schema validation
 * ```ts
 * pipe(fromPage, (p) => use(p)(withSearchParams(mySchema)))
 * ```
 */
export function withSearchParams<TSchema extends z.ZodType>(
  schema: TSchema
): (ctx: object, props: SearchParamsProps) => Promise<{ ctx: { searchParams: z.infer<TSchema> } }>;

export function withSearchParams<
  TSearchParams extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>
>(): <TContext extends object>(ctx: TContext, props: PageProps) => Promise<{ ctx: { searchParams: TSearchParams } }>;

export function withSearchParams<TSchema extends z.ZodType>(schema?: TSchema) {
  return async (_ctx: object, props: SearchParamsProps): Promise<{ ctx: { searchParams: unknown } }> => {
    const raw = (await props.searchParams) ?? {};
    const searchParams = schema ? schema.parse(raw) : raw;
    return { ctx: { searchParams } };
  };
}
