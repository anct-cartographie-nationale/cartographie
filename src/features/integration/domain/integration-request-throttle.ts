import type { IntegrationRequest } from './integration-request.schema';

export const THROTTLE_WINDOW_MS = 60 * 60 * 1000;

export type ThrottleEntry = {
  sentAt: number;
  sentFingerprint: string;
  pending?: IntegrationRequest;
};

export type ThrottleDecision =
  | { dispatch: 'now'; entry: ThrottleEntry }
  | { dispatch: 'later'; entry: ThrottleEntry; at: number }
  | { dispatch: 'none'; entry: ThrottleEntry };

export const fingerprint = (request: IntegrationRequest): string => JSON.stringify(request);

export const receiveRequest = (
  entry: ThrottleEntry | undefined,
  request: IntegrationRequest,
  now: number,
  windowMs: number = THROTTLE_WINDOW_MS
): ThrottleDecision => {
  if (entry == null || now - entry.sentAt >= windowMs) {
    return { dispatch: 'now', entry: { sentAt: now, sentFingerprint: fingerprint(request) } };
  }
  if (fingerprint(request) === entry.sentFingerprint) {
    return { dispatch: 'none', entry: { sentAt: entry.sentAt, sentFingerprint: entry.sentFingerprint } };
  }
  return {
    dispatch: entry.pending == null ? 'later' : 'none',
    entry: { ...entry, pending: request },
    at: entry.sentAt + windowMs
  };
};

export const flushPending = (
  entry: ThrottleEntry,
  now: number
): { entry: ThrottleEntry; request: IntegrationRequest | null } =>
  entry.pending == null
    ? { entry, request: null }
    : { entry: { sentAt: now, sentFingerprint: fingerprint(entry.pending) }, request: entry.pending };
