import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'feature', 'production']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().min(1, { message: 'App name must not be empty' }),
  NEXT_PUBLIC_BASE_PATH: z.string().refine((val) => val === '' || val.startsWith('/'), {
    message: "Must be empty or start with '/'"
  })
});

export const env = envSchema.parse(process.env);
