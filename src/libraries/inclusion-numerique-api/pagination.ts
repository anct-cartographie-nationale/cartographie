import { z } from 'zod';

export const paginationSchema = (defaultLimit: number = 24) =>
  z.object({
    page: z.coerce.number().int().positive().catch(1),
    limit: z.coerce.number().int().positive().catch(defaultLimit)
  });
