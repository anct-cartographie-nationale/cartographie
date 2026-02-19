import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default(''),
  NEXT_PUBLIC_BASE_PATH: z.string().default(''),
  NEXT_ASSET_PREFIX: z.string().default('')
});

export const clientEnv = clientEnvSchema.parse({});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
