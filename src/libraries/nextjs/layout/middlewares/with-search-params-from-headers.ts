import { headers } from 'next/headers';
import type { z } from 'zod';

export const withSearchParamsFromHeaders =
  <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  async (): Promise<{ ctx: { searchParams: z.infer<TSchema> } }> => {
    const requestHeaders = await headers();
    const currentUrl = requestHeaders.get('x-url');
    const rawSearchParams = currentUrl ? Object.fromEntries(new URL(currentUrl).searchParams) : {};
    return { ctx: { searchParams: schema.parse(rawSearchParams) } };
  };
