import { describe, expect, it } from 'vitest';
import { autourHref, autourSchema, withoutAutourParams, withoutAutourParamsInUrl } from './autour';

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

describe('withoutAutourParams', () => {
  it('removes the location and keeps everything else', () => {
    const searchParams = new URLSearchParams({ lat: '1', lng: '2', adresse: 'a', commune: '75056', services: 'b', page: '2' });

    expect(withoutAutourParams(searchParams).toString()).toBe('services=b&page=2');
  });
});

describe('withoutAutourParamsInUrl', () => {
  it('removes the location from a relative url', () => {
    expect(withoutAutourParamsInUrl('/autour?lat=48&lng=-4&adresse=59+rue+de+Brest&commune=29103')).toBe('/autour');
  });

  it('removes the location from an absolute url and keeps other params and hash', () => {
    expect(withoutAutourParamsInUrl('https://carto.fr/autour?lat=48&services=a&lng=-4#main')).toBe(
      'https://carto.fr/autour?services=a#main'
    );
  });

  it('returns an url without location untouched', () => {
    expect(withoutAutourParamsInUrl('/bretagne/finistere?services=a%20b')).toBe('/bretagne/finistere?services=a%20b');
  });

  it('returns an url without query untouched', () => {
    expect(withoutAutourParamsInUrl('/lieux')).toBe('/lieux');
  });
});
