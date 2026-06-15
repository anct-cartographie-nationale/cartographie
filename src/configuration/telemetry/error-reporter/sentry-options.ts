import { clientEnv } from '@/env.client';
import { scrubEvent } from './scrub-event';

export const baseSentryOptions = {
  tracesSampleRate: 0,
  sendDefaultPii: false,
  beforeSend: scrubEvent,
  ...(clientEnv.NEXT_PUBLIC_SENTRY_ENVIRONMENT ? { environment: clientEnv.NEXT_PUBLIC_SENTRY_ENVIRONMENT } : {})
};
