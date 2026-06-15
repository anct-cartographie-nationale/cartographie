import * as Sentry from '@sentry/nextjs';
import { clientEnv } from '@/env.client';
import { baseSentryOptions } from './sentry-options';

const BROWSER_NOISE = ['ResizeObserver loop limit exceeded', 'ResizeObserver loop completed with undelivered notifications.'];

const EXTENSION_URLS = [/^chrome-extension:\/\//, /^moz-extension:\/\//, /^safari-(web-)?extension:\/\//];

export const register = (): void => {
  if (!clientEnv.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.init({
    dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN,
    ...baseSentryOptions,
    ignoreErrors: BROWSER_NOISE,
    denyUrls: EXTENSION_URLS
  });
};

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
