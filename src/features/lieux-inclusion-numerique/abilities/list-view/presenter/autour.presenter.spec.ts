import { describe, expect, it } from 'vitest';
import { autourBreadcrumbs, autourExit, autourTitle } from './autour.presenter';

const LANDERNEAU = { lat: 48.45, lng: -4.25, adresse: '59 rue de Brest', commune: '29103' };

describe('autourTitle', () => {
  it('announces the number of nearest lieux', () => {
    expect(autourTitle(200, '59 rue de Brest')).toBe('Les 200 lieux les plus proches de 59 rue de Brest');
  });

  it('handles a single lieu', () => {
    expect(autourTitle(1, '59 rue de Brest')).toBe('Le lieu le plus proche de 59 rue de Brest');
  });

  it('handles no result', () => {
    expect(autourTitle(0, '59 rue de Brest')).toBe('Aucun lieu trouvé autour de 59 rue de Brest');
  });

  it('falls back on a generic label without address', () => {
    expect(autourTitle(200)).toBe('Les 200 lieux les plus proches de la position recherchée');
  });
});

describe('autourBreadcrumbs', () => {
  it('goes through the territory down to the address', () => {
    expect(autourBreadcrumbs(LANDERNEAU, new URLSearchParams())).toEqual([
      { label: 'France', href: '/' },
      { label: 'Bretagne', href: '/bretagne' },
      { label: 'Finistère', href: '/bretagne/finistere' },
      { label: 'À proximité' }
    ]);
  });

  it('keeps the filters in the links', () => {
    expect(autourBreadcrumbs(LANDERNEAU, new URLSearchParams({ services: 'a' }))[2]?.href).toBe(
      '/bretagne/finistere?services=a'
    );
  });

  it('skips the territory when the commune is unknown', () => {
    expect(autourBreadcrumbs({ lat: 48, lng: -4 }, new URLSearchParams())).toEqual([
      { label: 'France', href: '/' },
      { label: 'À proximité' }
    ]);
  });
});

describe('autourExit', () => {
  it('links to the department of the commune with the filters', () => {
    expect(autourExit(LANDERNEAU, new URLSearchParams({ services: 'a' }))).toEqual({
      label: 'Voir tous les lieux du département : Finistère',
      href: '/bretagne/finistere?services=a'
    });
  });

  it('returns nothing when the commune is unknown', () => {
    expect(autourExit({ lat: 48, lng: -4 }, new URLSearchParams())).toBeUndefined();
  });
});
