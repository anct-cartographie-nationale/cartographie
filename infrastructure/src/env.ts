import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const envSchema = z.object({
  SCW_ACCESS_KEY: z.string().min(1, { message: 'Scaleway access key must not be empty' }),
  SCW_SECRET_KEY: z.string().min(1, { message: 'Scaleway secret key must not be empty' }),
  SCW_DEFAULT_PROJECT_ID: z.string().min(1, { message: 'Scaleway project id must not be empty' }),
  TAGS: z
    .string()
    .min(1, { message: 'Tags must not be empty' })
    .transform((val) =>
      val
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
