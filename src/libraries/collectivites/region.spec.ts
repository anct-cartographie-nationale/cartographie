import { describe, expect, it } from 'vitest';
import { matchingDepartementsFrom, regionMatchingDepartement, regionMatchingSlug } from './region';

describe('regionMatchingSlug', () => {
  it('should return true when region slug matches', () => {
    const matcher = regionMatchingSlug('ile-de-france');

    expect(matcher({ slug: 'ile-de-france' })).toBe(true);
  });

  it('should return false when region slug does not match', () => {
    const matcher = regionMatchingSlug('ile-de-france');

    expect(matcher({ slug: 'provence-alpes-cote-d-azur' })).toBe(false);
  });

  it('should return false when slug is undefined', () => {
    const matcher = regionMatchingSlug(undefined);

    expect(matcher({ slug: 'ile-de-france' })).toBe(false);
  });
});

describe('matchingDepartementsFrom', () => {
  it('should return true when department code is in region departements', () => {
    const region = { departements: ['75', '77', '78', '91', '92', '93', '94', '95'] };
    const matcher = matchingDepartementsFrom(region);

    expect(matcher({ code: '75' })).toBe(true);
    expect(matcher({ code: '93' })).toBe(true);
  });

  it('should return false when department code is not in region departements', () => {
    const region = { departements: ['75', '77', '78', '91', '92', '93', '94', '95'] };
    const matcher = matchingDepartementsFrom(region);

    expect(matcher({ code: '13' })).toBe(false);
    expect(matcher({ code: '69' })).toBe(false);
  });
});

describe('regionMatchingDepartement', () => {
  it('should return true when region contains the department', () => {
    const departement = { code: '75' };
    const matcher = regionMatchingDepartement(departement);

    expect(matcher({ departements: ['75', '77', '78'] })).toBe(true);
  });

  it('should return false when region does not contain the department', () => {
    const departement = { code: '13' };
    const matcher = regionMatchingDepartement(departement);

    expect(matcher({ departements: ['75', '77', '78'] })).toBe(false);
  });
});
