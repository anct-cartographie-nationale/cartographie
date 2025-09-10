import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'feature', 'production']).default('development'),
  PROTOCOL: z.enum(['http', 'https']).default('https'),
  HOSTNAME: z.string().default('localhost'),
  PORT: z.coerce.number().int().min(1).max(65535).nullish(),
  INCLUSION_NUMERIQUE_API_TOKEN: z.string().min(1, { message: 'INCLUSION_NUMERIQUE_API_TOKEN must not be empty' }),
  NEXT_PUBLIC_APP_NAME: z.string().min(1, { message: 'NEXT_PUBLIC_APP_NAME must not be empty' }),
  NEXT_PUBLIC_BASE_PATH: z.string().refine((val) => val === '' || val.startsWith('/'), {
    message: "NEXT_PUBLIC_BASE_PATH must be empty or start with '/'"
  }),
  NEXT_ASSET_PREFIX: z.string().refine((val) => val === '' || val.length > 0, {
    message: 'NEXT_ASSET_PREFIX must be empty or a valid prefix'
  })
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
