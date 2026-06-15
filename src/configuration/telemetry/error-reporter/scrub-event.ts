import type { ErrorEvent } from '@sentry/nextjs';

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const REDACTED_EMAIL = '[redacted-email]';

const redactEmails = (value: string): string => value.replace(EMAIL_PATTERN, REDACTED_EMAIL);

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
    : {})
});
