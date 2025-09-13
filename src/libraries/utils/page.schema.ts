import { z } from 'zod';

export const pageSchema = z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1)).catch(1);
