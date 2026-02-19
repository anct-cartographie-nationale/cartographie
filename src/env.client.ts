import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1, { message: 'NEXT_PUBLIC_APP_NAME must not be empty' }),
  NEXT_PUBLIC_BASE_PATH: z.string().default(''),
  NEXT_ASSET_PREFIX: z.string().default('')
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env['NEXT_PUBLIC_APP_NAME'],
  NEXT_PUBLIC_BASE_PATH: process.env['NEXT_PUBLIC_BASE_PATH'],
  NEXT_ASSET_PREFIX: process.env['NEXT_ASSET_PREFIX']
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
