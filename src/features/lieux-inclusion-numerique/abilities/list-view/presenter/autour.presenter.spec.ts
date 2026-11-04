import { describe, expect, it } from 'vitest';
import { autourBreadcrumbs, autourExit, autourStatus, autourTitle, withNearestCommune } from './autour.presenter';

const LANDERNEAU = { lat: 48.45, lng: -4.25, adresse: '59 rue de Brest', commune: '29103' };

const ADRESSE = { adresse: '59 rue de Brest' };
const LIEU = {
  nom: 'Mairie',
  adresse: { numero_voie: '1', repetition: '', nom_voie: 'rue', commune: 'Brest', code_postal: '29200', code_insee: '29019' }
};

describe('autourTitle', () => {
  it('announces the number of nearest lieux', () => {
    expect(autourTitle(200, ADRESSE)).toBe('Les 200 lieux les plus proches de 59 rue de Brest');
  });

  it('handles a single lieu', () => {
    expect(autourTitle(1, ADRESSE)).toBe('Le lieu le plus proche de 59 rue de Brest');
  });

  it('handles no result', () => {
    expect(autourTitle(0, ADRESSE)).toBe('Aucun lieu trouvé autour de 59 rue de Brest');
  });

  it('names the geolocated position', () => {
    expect(autourTitle(200, { geolocalise: '1' })).toBe('Les 200 lieux les plus proches de votre position');
  });

  it('names the centre of the map without address nor geolocation', () => {
    expect(autourTitle(200, {})).toBe('Les 200 lieux les plus proches du centre de la carte');
    expect(autourTitle(0, {})).toBe('Aucun lieu trouvé autour du centre de la carte');
  });
});

describe('autourStatus', () => {
  it('announces the nearest lieu when the map drives the list', () => {
    expect(autourStatus({}, LIEU)).toBe('Liste triée autour du centre de la carte. Lieu le plus proche : Mairie, à Brest.');
  });

  it('changes with the nearest lieu so that each new order is announced', () => {
    expect(autourStatus({}, LIEU)).not.toBe(autourStatus({}, { ...LIEU, nom: 'Médiathèque' }));
  });

  it('announces the absence of result', () => {
    expect(autourStatus({})).toBe('Aucun lieu trouvé autour du centre de la carte.');
  });

  it('stays silent for an address or a geolocation, whose title takes the focus', () => {
    expect(autourStatus(ADRESSE, LIEU)).toBe('');
    expect(autourStatus({ geolocalise: '1' }, LIEU)).toBe('');
  });
});

describe('withNearestCommune', () => {
  it('uses the commune of the nearest lieu when none is known', () => {
    expect(withNearestCommune({ lat: 48, lng: -4 }, [LIEU]).commune).toBe('29019');
  });

  it('keeps the commune of the search', () => {
    expect(withNearestCommune({ lat: 48, lng: -4, commune: '29103' }, [LIEU]).commune).toBe('29103');
  });

  it('leaves the commune unknown without lieu', () => {
    expect(withNearestCommune({ lat: 48, lng: -4 }, []).commune).toBeUndefined();
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
