import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'feature', 'production']).default('development')
});

export const env = envSchema.parse(process.env);
