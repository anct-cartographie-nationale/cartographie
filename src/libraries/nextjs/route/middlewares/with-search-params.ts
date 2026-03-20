import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type TreeifyErrorResult = { errors: string[]; properties?: Record<string, unknown> };

export function withSearchParams<TSchema extends z.ZodType>(
  schema: TSchema
): (ctx: object, request: NextRequest) => Promise<{ ctx: { searchParams: z.infer<TSchema> } } | NextResponse>;

export function withSearchParams<TSchema extends z.ZodType>(schema: TSchema) {
  return async (_ctx: object, request: NextRequest) => {
    const url = new URL(request.url);
    const rawParams = Object.fromEntries(url.searchParams.entries());
    const parsed = schema.safeParse(rawParams);

    if (!parsed.success) {
      const treeError = z.treeifyError(parsed.error) as TreeifyErrorResult;
      return NextResponse.json({ error: treeError.properties }, { status: 422 });
    }

    return { ctx: { searchParams: parsed.data } };
  };
}
