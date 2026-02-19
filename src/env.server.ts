import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'feature', 'production']).default('development'),
  PROTOCOL: z.enum(['http', 'https']).default('https'),
  HOSTNAME: z.string().default('localhost'),
  PORT: z.coerce.number().int().min(1).max(65535).nullish(),
  INCLUSION_NUMERIQUE_API_TOKEN: z.string().min(1, { message: 'INCLUSION_NUMERIQUE_API_TOKEN must not be empty' })
});

export const serverEnv = serverEnvSchema.parse(process.env);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
