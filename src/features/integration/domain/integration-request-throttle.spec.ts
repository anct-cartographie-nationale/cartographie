import { describe, expect, it } from 'vitest';
import type { IntegrationRequest } from './integration-request.schema';
import { flushPending, receiveRequest, THROTTLE_WINDOW_MS, throttleKey } from './integration-request-throttle';

const request: IntegrationRequest = {
  email: 'marie@example.fr',
  territoire: { type: 'departement', code: '29', nom: 'Finistère' },
  vue: 'filtree',
  sortie: 'lien',
  lien: 'https://carto.test/bretagne/finistere'
};

const changed: IntegrationRequest = { ...request, sortie: 'qr-code' };

describe('throttleKey', () => {
  it('should differ when the territory changes', () => {
    const otherTerritoire: IntegrationRequest = {
      ...request,
      territoire: { type: 'departement', code: '22', nom: 'Côtes-d’Armor' }
    };

    expect(throttleKey(otherTerritoire)).not.toBe(throttleKey(request));
  });

  it('should differ between two kinds of territory sharing a code', () => {
    const otherType: IntegrationRequest = { ...request, territoire: { type: 'region', code: '29', nom: 'Autre' } };

    expect(throttleKey(otherType)).not.toBe(throttleKey(request));
  });

  it('should stay the same when only the output changes', () => {
    expect(throttleKey(changed)).toBe(throttleKey(request));
  });

  it('should ignore the case of the email', () => {
    expect(throttleKey({ ...request, email: 'Marie@Example.fr' })).toBe(throttleKey(request));
  });
});

describe('integration request throttle', () => {
  it('should dispatch the first request immediately', () => {
    const decision = receiveRequest(undefined, request, 1000);

    expect(decision.dispatch).toBe('now');
    expect(decision.entry.sentAt).toBe(1000);
    expect(decision.entry.pending).toBeUndefined();
  });

  it('should dispatch immediately again once the window has elapsed', () => {
    const { entry } = receiveRequest(undefined, request, 1000);

    const decision = receiveRequest(entry, changed, 1000 + THROTTLE_WINDOW_MS);

    expect(decision.dispatch).toBe('now');
    expect(decision.entry.sentAt).toBe(1000 + THROTTLE_WINDOW_MS);
  });

  it('should ignore an identical request inside the window', () => {
    const { entry } = receiveRequest(undefined, request, 1000);

    const decision = receiveRequest(entry, request, 2000);

    expect(decision.dispatch).toBe('none');
    expect(decision.entry.pending).toBeUndefined();
  });

  it('should schedule a changed request at the end of the window', () => {
    const { entry } = receiveRequest(undefined, request, 1000);

    const decision = receiveRequest(entry, changed, 2000);

    expect(decision).toMatchObject({ dispatch: 'later', at: 1000 + THROTTLE_WINDOW_MS });
    expect(decision.entry.pending).toEqual(changed);
  });

  it('should replace the pending request without scheduling twice', () => {
    const { entry: first } = receiveRequest(undefined, request, 1000);
    const { entry: scheduled } = receiveRequest(first, changed, 2000);
    const latest: IntegrationRequest = { ...request, sortie: 'iframe' };

    const decision = receiveRequest(scheduled, latest, 3000);

    expect(decision.dispatch).toBe('none');
    expect(decision.entry.pending).toEqual(latest);
  });

  it('should ignore a request identical to the one already sent even when another is pending', () => {
    const { entry: first } = receiveRequest(undefined, request, 1000);
    const { entry: scheduled } = receiveRequest(first, changed, 2000);

    const decision = receiveRequest(scheduled, request, 3000);

    expect(decision.dispatch).toBe('none');
    expect(decision.entry.pending).toBeUndefined();
  });

  it('should flush the pending request and open a new window', () => {
    const { entry: first } = receiveRequest(undefined, request, 1000);
    const { entry: scheduled } = receiveRequest(first, changed, 2000);

    const flushed = flushPending(scheduled, 1000 + THROTTLE_WINDOW_MS);

    expect(flushed.request).toEqual(changed);
    expect(flushed.entry.sentAt).toBe(1000 + THROTTLE_WINDOW_MS);
    expect(flushed.entry.pending).toBeUndefined();
  });

  it('should flush nothing when no request is pending', () => {
    const { entry } = receiveRequest(undefined, request, 1000);

    expect(flushPending(entry, 2000)).toEqual({ entry, request: null });
  });
});
