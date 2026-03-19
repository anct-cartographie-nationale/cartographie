import type { NextRequest } from 'next/server';
import type { z } from 'zod';

export function withSearchParams<TSchema extends z.ZodType>(
  schema: TSchema
): (ctx: object, request: NextRequest) => Promise<{ ctx: { searchParams: z.infer<TSchema> } }>;

export function withSearchParams<TSchema extends z.ZodType>(schema: TSchema) {
  return async (_ctx: object, request: NextRequest): Promise<{ ctx: { searchParams: z.infer<TSchema> } }> => {
    const url = new URL(request.url);
    const rawParams = Object.fromEntries(url.searchParams.entries());
    return { ctx: { searchParams: schema.parse(rawParams) } };
  };
}
