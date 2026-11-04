import { describe, expect, it } from 'vitest';
import {
  AUTOUR_PATH,
  autourHref,
  autourKey,
  autourLocalisation,
  autourNavigation,
  autourSchema,
  isMapCentreAutour,
  withoutAutourParams
} from './autour';

describe('autourSchema', () => {
  it('parses coordinates, address and commune', () => {
    expect(autourSchema.parse({ lat: '48.45', lng: '-4.25', adresse: ' 59 rue de Brest ', commune: '29103' })).toEqual({
      lat: 48.45,
      lng: -4.25,
      adresse: '59 rue de Brest',
      commune: '29103'
    });
  });

  it('rejects missing or empty coordinates', () => {
    expect(autourSchema.safeParse({ lng: '-4.25' }).success).toBe(false);
    expect(autourSchema.safeParse({ lat: '', lng: '-4.25' }).success).toBe(false);
  });

  it('rejects out of range coordinates', () => {
    expect(autourSchema.safeParse({ lat: '91', lng: '0' }).success).toBe(false);
    expect(autourSchema.safeParse({ lat: '0', lng: '181' }).success).toBe(false);
  });

  it('drops an invalid commune without rejecting the coordinates', () => {
    expect(autourSchema.parse({ lat: '48', lng: '-4', commune: 'abc' }).commune).toBeUndefined();
  });

  it('accepts a Corsican commune code', () => {
    expect(autourSchema.parse({ lat: '42', lng: '9', commune: '2A004' }).commune).toBe('2A004');
  });
});

describe('autourHref', () => {
  it('builds the href from the location', () => {
    expect(autourHref({ lat: 48.45, lng: -4.25, adresse: 'Brest', commune: '29019' }, new URLSearchParams())).toBe(
      '/autour?lat=48.45&lng=-4.25&adresse=Brest&commune=29019'
    );
  });

  it('keeps filters and drops the page and the previous location', () => {
    const searchParams = new URLSearchParams({
      services: 'a',
      page: '3',
      lat: '1',
      lng: '2',
      adresse: 'old',
      commune: '75056'
    });

    expect(autourHref({ lat: 48, lng: -4 }, searchParams)).toBe('/autour?services=a&lat=48&lng=-4');
  });

  it('does not alter the given search params', () => {
    const searchParams = new URLSearchParams({ page: '3' });

    autourHref({ lat: 48, lng: -4 }, searchParams);

    expect(searchParams.get('page')).toBe('3');
  });
});

describe('autourKey', () => {
  it('identifies a location whatever its label', () => {
    expect(autourKey({ lat: 48.45, lng: -4.25 })).toBe('48.45,-4.25');
  });

  it('is the same before and after a round trip through the url', () => {
    const lieu = autourSchema.parse({ lat: String(48.450798), lng: String(-4.257626) });

    expect(autourKey(lieu)).toBe(autourKey({ lat: 48.450798, lng: -4.257626 }));
  });
});

describe('isMapCentreAutour', () => {
  it('is true without address nor geolocation', () => {
    expect(isMapCentreAutour({})).toBe(true);
  });

  it('is false for an address or a geolocation', () => {
    expect(isMapCentreAutour({ adresse: 'Brest' })).toBe(false);
    expect(isMapCentreAutour({ geolocalise: '1' })).toBe(false);
  });
});

describe('autourLocalisation', () => {
  it('gives the reference point of an address or a geolocation', () => {
    expect(autourLocalisation({ lat: 48, lng: -4, adresse: 'Brest' })).toEqual({ latitude: 48, longitude: -4 });
    expect(autourLocalisation({ lat: 48, lng: -4, geolocalise: '1' })).toEqual({ latitude: 48, longitude: -4 });
  });

  it('gives no reference point for the centre of the map', () => {
    expect(autourLocalisation({ lat: 48, lng: -4 })).toBeUndefined();
  });
});

describe('autourNavigation', () => {
  it('adds a history entry when leaving a territory page', () => {
    expect(autourNavigation('/bretagne/finistere', new URLSearchParams())).toBe('push');
  });

  it('adds a history entry when leaving an address or a geolocation', () => {
    expect(autourNavigation(AUTOUR_PATH, new URLSearchParams({ lat: '48', lng: '-4', adresse: 'Brest' }))).toBe('push');
    expect(autourNavigation(AUTOUR_PATH, new URLSearchParams({ lat: '48', lng: '-4', geolocalise: '1' }))).toBe('push');
  });

  it('replaces the entry when the map keeps moving', () => {
    expect(autourNavigation(AUTOUR_PATH, new URLSearchParams({ lat: '48', lng: '-4' }))).toBe('replace');
  });
});

describe('withoutAutourParams', () => {
  it('removes the location and keeps everything else', () => {
    const searchParams = new URLSearchParams({
      lat: '1',
      lng: '2',
      adresse: 'a',
      commune: '75056',
      geolocalise: '1',
      services: 'b',
      page: '2'
    });

    expect(withoutAutourParams(searchParams).toString()).toBe('services=b&page=2');
  });
});
