import { describe, expect, it } from 'vitest';
import type { Territoire } from './territoire';
import { buildWebComponentHtml } from './web-component-html';

const finistere: Territoire = {
  type: 'departement',
  code: '29',
  nom: 'Finistère',
  localisation: { latitude: 48.26, longitude: -4.06 },
  zoom: 9.3,
  path: '/bretagne/finistere',
  filtre: { type: 'departements', codes: ['29'] }
};

describe('buildWebComponentHtml', () => {
  it('should produce a standalone page with the pinned package version and filtered attributes', () => {
    const html = buildWebComponentHtml({
      siteUrl: 'https://carto.test',
      version: '6.29.3',
      territoire: finistere,
      vue: 'filtree',
      appName: 'Lieux du Finistère'
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>Lieux du Finistère</title>');
    expect(html).toContain(
      'https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.29.3/dist-wc/cartographie-nationale.css'
    );
    expect(html).toContain(
      'https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.29.3/dist-wc/cartographie.umd.js'
    );
    expect(html).toContain('api-url="https://carto.test/api"');
    expect(html).toContain('app-name="Lieux du Finistère"');
    expect(html).toContain('latitude="48.26"');
    expect(html).toContain('longitude="-4.06"');
    expect(html).toContain('zoom="9.3"');
    expect(html).toContain('territoire-type="departements"');
    expect(html).toContain('territoires="29"');
    expect(html).toContain('route-initiale="/bretagne/finistere"');
    expect(html).not.toContain('logo-url');
    expect(html).not.toContain('<style>');
  });

  it('should omit the territoire attributes for a centered view', () => {
    const html = buildWebComponentHtml({
      siteUrl: 'https://carto.test',
      version: '6.29.3',
      territoire: finistere,
      vue: 'centree',
      appName: 'Carte'
    });

    expect(html).not.toContain('territoire-type');
    expect(html).not.toContain('territoires=');
    expect(html).not.toContain('route-initiale');
    expect(html).toContain('latitude="48.26"');
  });

  it('should add logo and theme colors when provided', () => {
    const html = buildWebComponentHtml({
      siteUrl: 'https://carto.test',
      version: '6.29.3',
      territoire: finistere,
      vue: 'filtree',
      appName: 'Carte',
      logoUrl: 'https://carto.test/logo.png',
      colorPrimary: '#000091',
      colorPrimaryContent: '#ffffff'
    });

    expect(html).toContain('logo-url="https://carto.test/logo.png"');
    expect(html).toContain('--color-primary: #000091;');
    expect(html).toContain('--color-primary-content: #ffffff;');
  });

  it('should escape double quotes in attribute values', () => {
    const html = buildWebComponentHtml({
      siteUrl: 'https://carto.test',
      version: '6.29.3',
      territoire: finistere,
      vue: 'centree',
      appName: 'Carte "officielle" & co'
    });

    expect(html).toContain('app-name="Carte &quot;officielle&quot; &amp; co"');
    expect(html).toContain('<title>Carte &quot;officielle&quot; &amp; co</title>');
  });
});
