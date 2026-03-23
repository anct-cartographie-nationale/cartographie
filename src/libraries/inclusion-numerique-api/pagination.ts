import { z } from 'zod';

export const paginationSchema = (limit: number) =>
  z.object({
    page: z.coerce.number().int().positive().catch(1),
    limit: z.coerce.number().int().positive().catch(limit)
  });
