import { clientEnv } from '@/env.client';
import { scrubEvent } from './scrub-event';

export const baseSentryOptions = {
  tracesSampleRate: 0,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] }
    },
    httpBodies: [],
    urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    graphQL: { document: false, variables: false }
  },
  beforeSend: scrubEvent,
  ...(clientEnv.NEXT_PUBLIC_SENTRY_ENVIRONMENT ? { environment: clientEnv.NEXT_PUBLIC_SENTRY_ENVIRONMENT } : {})
};
