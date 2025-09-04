import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'feature', 'production']).default('development'),
  PROTOCOL: z.enum(['http', 'https']).default('https'),
  HOSTNAME: z.string().min(1, { message: 'Hostname must not be empty' }),
  PORT: z.coerce.number().int().min(1).max(65535).nullish(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1, { message: 'App name must not be empty' }),
  NEXT_PUBLIC_BASE_PATH: z.string().refine((val) => val === '' || val.startsWith('/'), {
    message: "Must be empty or start with '/'"
  }),
  NEXT_ASSET_PREFIX: z.string().refine((val) => val === '' || val.length > 0, {
    message: 'Must be empty or a valid prefix'
  })
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
