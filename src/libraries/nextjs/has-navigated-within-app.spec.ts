import { describe, expect, it } from 'vitest';
import { hasNavigatedWithinApp } from './has-navigated-within-app';

const FICHE = 'https://carto.test/bretagne/finistere/lieux/269';

describe('has navigated within app', () => {
  it('is false on the page that loaded the document', () => {
    expect(hasNavigatedWithinApp(FICHE, FICHE)).toBe(false);
  });

  it('is false when only a filter changed the url of that page', () => {
    expect(hasNavigatedWithinApp(FICHE, `${FICHE}?services=numerique`)).toBe(false);
  });

  it('is true when arriving from another page', () => {
    expect(hasNavigatedWithinApp('https://carto.test/bretagne/finistere', FICHE)).toBe(true);
  });

  it('is true when arriving from another page with a filter', () => {
    expect(
      hasNavigatedWithinApp('https://carto.test/bretagne/finistere?services=numerique', `${FICHE}?services=numerique`)
    ).toBe(true);
  });

  it('is false when the document is unknown', () => {
    expect(hasNavigatedWithinApp(undefined, FICHE)).toBe(false);
  });
});
