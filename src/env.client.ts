import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1, { message: 'NEXT_PUBLIC_APP_NAME must not be empty' }),
  NEXT_PUBLIC_BASE_PATH: z.string().default(''),
  NEXT_ASSET_PREFIX: z.string().default(''),
  NEXT_PUBLIC_MATOMO_URL: z.string().url().optional(),
  NEXT_PUBLIC_MATOMO_SITE_ID: z.string().optional()
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env['NEXT_PUBLIC_APP_NAME'],
  NEXT_PUBLIC_BASE_PATH: process.env['NEXT_PUBLIC_BASE_PATH'],
  NEXT_ASSET_PREFIX: process.env['NEXT_ASSET_PREFIX'],
  NEXT_PUBLIC_MATOMO_URL: process.env['NEXT_PUBLIC_MATOMO_URL'],
  NEXT_PUBLIC_MATOMO_SITE_ID: process.env['NEXT_PUBLIC_MATOMO_SITE_ID']
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
