import { createWithErrorHandler } from '@arckit/nextjs/route';
import { withErrorReporter as createWithErrorReporter } from '@arckit/nextjs/telemetry';
import * as Sentry from '@sentry/nextjs';
import { clientEnv } from '@/env.client';
import { errorReporter } from './report-error';
import { baseSentryOptions } from './sentry-options';

export const register = (): void => {
  if (!clientEnv.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.init({ dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN, ...baseSentryOptions });
};

// Tag les erreurs serveur avec le request_id propagé par nginx (header X-Request-Id)
// → corrélation entre les access logs nginx et l'event Sentry.
export const onRequestError = (...[error, request, errorContext]: Parameters<typeof Sentry.captureRequestError>): void => {
  const requestId = request.headers['x-request-id'];
  Sentry.withScope((scope) => {
    if (typeof requestId === 'string') scope.setTag('request_id', requestId);
    Sentry.captureRequestError(error, request, errorContext);
  });
};

export const withErrorReporter = createWithErrorReporter(errorReporter);

export const withErrorHandler = createWithErrorHandler(errorReporter);
