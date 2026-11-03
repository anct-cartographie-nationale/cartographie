import { describe, expect, it } from 'vitest';
import { buildIframeHtml } from './iframe-html';
import type { Territoire } from './territoire';

const finistere: Territoire = {
  type: 'departement',
  code: '29',
  nom: 'Finistère',
  localisation: { latitude: 48.26, longitude: -4.06 },
  zoom: 9.3,
  path: '/bretagne/finistere',
  filtre: { type: 'departements', codes: ['29'] }
};

describe('buildIframeHtml', () => {
  it('should point to the integration url in iframe mode', () => {
    const html = buildIframeHtml({ siteUrl: 'https://carto.test', territoire: finistere, vue: 'filtree' });

    expect(html).toContain(
      'src="https://carto.test/bretagne/finistere?territoire_type=departements&amp;territoires=29&amp;latitude=48.26&amp;longitude=-4.06&amp;zoom=9.3&amp;mtm_campaign=integrationweb&amp;mtm_kwd=finisteredepartement&amp;integration=iframe"'
    );
  });

  it('should set an accessible title, a full width and a fixed height', () => {
    const html = buildIframeHtml({ siteUrl: 'https://carto.test', territoire: finistere, vue: 'centree' });

    expect(html).toContain('title="Cartographie des lieux d\'inclusion numérique - Finistère"');
    expect(html).toContain('width="100%"');
    expect(html).toContain('height="800"');
    expect(html).toContain('allow="geolocation"');
  });
});
