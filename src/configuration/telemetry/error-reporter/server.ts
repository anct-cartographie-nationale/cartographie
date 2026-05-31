import * as Sentry from '@sentry/nextjs';
import { clientEnv } from '@/env.client';

export const register = (): void => {
  if (!clientEnv.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.init({ dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: 0 });
};

export const onRequestError = Sentry.captureRequestError;
