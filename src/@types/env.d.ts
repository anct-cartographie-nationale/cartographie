import type { ClientEnv } from '@/env.client';
import type { ServerEnv } from '@/env.server';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ClientEnv, ServerEnv {
      NEXT_RUNTIME?: 'nodejs' | 'edge';
      TZ?: string;
    }
  }
}
