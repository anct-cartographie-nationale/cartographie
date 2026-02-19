import { z } from 'zod';

export const paginationSearchSchema = z.looseObject({
  page: z.coerce.number().optional().default(1)
});
