import { describe, expect, it } from 'vitest';
import { buildIntegrationUrl, matomoKeyword } from './integration-url';
import type { Territoire } from './territoire';

const finistere: Territoire = {
  type: 'departement',
  code: '29',
  nom: 'Finistère',
  localisation: { latitude: 48.260000001, longitude: -4.0599999 },
  zoom: 9.3,
  path: '/bretagne/finistere',
  filtre: { type: 'departements', codes: ['29'] }
};

const epci: Territoire = {
  type: 'epci',
  nom: 'CA du Pays de Landerneau-Daoulas',
  code: '242900835',
  localisation: { latitude: 48.45, longitude: -4.25 },
  zoom: 11,
  path: '/bretagne/finistere',
  filtre: { type: 'communes', codes: ['29103', '29043'] }
};

describe('matomoKeyword', () => {
  it('should concatenate the compact slug of the name with the territoire type', () => {
    expect(matomoKeyword(finistere)).toBe('finisteredepartement');
    expect(matomoKeyword(epci)).toBe('cadupaysdelanderneaudaoulasepci');
  });
});

describe('buildIntegrationUrl', () => {
  it('should build a filtered url with territoire, position and matomo campaign', () => {
    expect(buildIntegrationUrl({ siteUrl: 'https://carto.test', territoire: finistere, vue: 'filtree' })).toBe(
      'https://carto.test/bretagne/finistere?territoire_type=departements&territoires=29&latitude=48.26&longitude=-4.06&zoom=9.3&mtm_campaign=integrationweb&mtm_kwd=finisteredepartement'
    );
  });

  it('should omit the territoire filter for a centered view', () => {
    expect(buildIntegrationUrl({ siteUrl: 'https://carto.test', territoire: finistere, vue: 'centree' })).toBe(
      'https://carto.test/bretagne/finistere?latitude=48.26&longitude=-4.06&zoom=9.3&mtm_campaign=integrationweb&mtm_kwd=finisteredepartement'
    );
  });

  it('should join several commune codes with commas', () => {
    expect(buildIntegrationUrl({ siteUrl: 'https://carto.test', territoire: epci, vue: 'filtree' })).toContain(
      'territoire_type=communes&territoires=29103,29043'
    );
  });

  it('should not double the slash when the site url has a trailing one', () => {
    expect(buildIntegrationUrl({ siteUrl: 'https://carto.test/', territoire: finistere, vue: 'centree' })).toMatch(
      /^https:\/\/carto\.test\/bretagne\/finistere\?/
    );
  });
});
