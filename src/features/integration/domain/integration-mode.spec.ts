import { describe, expect, it } from 'vitest';
import { isIframeMode, withIframeMode } from './integration-mode';

describe('integration mode', () => {
  it('should detect the iframe mode from search params', () => {
    expect(isIframeMode({ integration: 'iframe' })).toBe(true);
  });

  it('should not detect the iframe mode when the param is absent or different', () => {
    expect(isIframeMode({})).toBe(false);
    expect(isIframeMode({ integration: 'autre' })).toBe(false);
  });

  it('should append the iframe mode to a url that already has params', () => {
    expect(withIframeMode('https://carto.test/bretagne?zoom=9')).toBe('https://carto.test/bretagne?zoom=9&integration=iframe');
  });

  it('should append the iframe mode to a url without params', () => {
    expect(withIframeMode('https://carto.test/bretagne')).toBe('https://carto.test/bretagne?integration=iframe');
  });
});
