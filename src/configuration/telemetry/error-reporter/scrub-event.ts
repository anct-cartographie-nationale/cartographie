import type { Breadcrumb, ErrorEvent } from '@sentry/nextjs';
import { withoutAutourParams, withoutAutourParamsInUrl } from '@/libraries/inclusion-numerique-api/filters/autour';

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const REDACTED_EMAIL = '[redacted-email]';

const redactEmails = (value: string): string => value.replace(EMAIL_PATTERN, REDACTED_EMAIL);

const BREADCRUMB_URL_KEYS = ['url', 'from', 'to'];

const scrubBreadcrumb = (breadcrumb: Breadcrumb): Breadcrumb =>
  breadcrumb.data
    ? {
        ...breadcrumb,
        data: Object.fromEntries(
          Object.entries(breadcrumb.data).map(([key, value]) => [
            key,
            BREADCRUMB_URL_KEYS.includes(key) && typeof value === 'string' ? withoutAutourParamsInUrl(value) : value
          ])
        )
      }
    : breadcrumb;

const scrubRequest = (request: NonNullable<ErrorEvent['request']>): NonNullable<ErrorEvent['request']> => ({
  ...request,
  ...(request.url ? { url: withoutAutourParamsInUrl(request.url) } : {}),
  ...(typeof request.query_string === 'string'
    ? { query_string: withoutAutourParams(new URLSearchParams(request.query_string)).toString() }
    : {})
});

export const scrubEvent = (event: ErrorEvent): ErrorEvent => ({
  ...event,
  ...(event.message ? { message: redactEmails(event.message) } : {}),
  ...(event.exception?.values
    ? {
        exception: {
          ...event.exception,
          values: event.exception.values.map((value) => (value.value ? { ...value, value: redactEmails(value.value) } : value))
        }
      }
    : {}),
  ...(event.request ? { request: scrubRequest(event.request) } : {}),
  ...(event.breadcrumbs ? { breadcrumbs: event.breadcrumbs.map(scrubBreadcrumb) } : {})
});
