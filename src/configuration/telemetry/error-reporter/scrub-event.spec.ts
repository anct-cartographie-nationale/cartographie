import type { ErrorEvent } from '@sentry/nextjs';
import { describe, expect, it } from 'vitest';
import { scrubEvent } from './scrub-event';

describe('scrubEvent', () => {
  it('redacts an email in the event message', () => {
    const event = { type: undefined, message: 'Failed to send to john.doe@example.com' } satisfies ErrorEvent;

    expect(scrubEvent(event).message).toBe('Failed to send to [redacted-email]');
  });

  it('redacts emails in exception values', () => {
    const event = {
      type: undefined,
      exception: { values: [{ value: 'contact jane@foo.fr now' }] }
    } satisfies ErrorEvent;

    expect(scrubEvent(event).exception?.values?.[0]?.value).toBe('contact [redacted-email] now');
  });

  it('redacts every email when several are present', () => {
    const event = { type: undefined, message: 'a@b.com and c@d.org' } satisfies ErrorEvent;

    expect(scrubEvent(event).message).toBe('[redacted-email] and [redacted-email]');
  });

  it('leaves an event without email unchanged', () => {
    const event = { type: undefined, message: 'Network timeout' } satisfies ErrorEvent;

    expect(scrubEvent(event).message).toBe('Network timeout');
  });

  it('preserves other event fields', () => {
    const event = { type: undefined, message: 'x@y.com', level: 'error', tags: { route: 'contact' } } satisfies ErrorEvent;

    const scrubbed = scrubEvent(event);

    expect(scrubbed.level).toBe('error');
    expect(scrubbed.tags).toEqual({ route: 'contact' });
  });
});
