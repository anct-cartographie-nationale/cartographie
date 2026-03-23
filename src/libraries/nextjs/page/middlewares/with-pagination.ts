import type { z } from 'zod';
import type { PageProps } from '../page-props';

export const withPagination =
  <TSchema extends z.ZodType<number>>(schema: TSchema) =>
  async (_ctx: object, props: PageProps): Promise<{ ctx: { page: number } }> => {
    const searchParams = await props.searchParams;
    return { ctx: { page: schema.parse(searchParams['page']) } };
  };
