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

export const onRequestError = Sentry.captureRequestError;

export const withErrorReporter = createWithErrorReporter(errorReporter);

export const withErrorHandler = createWithErrorHandler(errorReporter);
