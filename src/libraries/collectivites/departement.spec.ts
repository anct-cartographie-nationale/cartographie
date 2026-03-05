import { describe, expect, it } from 'vitest';
import { departementMatchingCode, departementMatchingSlug } from './departement';

describe('departementMatchingCode', () => {
  it('should return true when department code matches', () => {
    const matcher = departementMatchingCode('75');

    expect(matcher({ code: '75' })).toBe(true);
  });

  it('should return false when department code does not match', () => {
    const matcher = departementMatchingCode('75');

    expect(matcher({ code: '13' })).toBe(false);
  });

  it('should handle DOM department codes', () => {
    const matcher = departementMatchingCode('971');

    expect(matcher({ code: '971' })).toBe(true);
    expect(matcher({ code: '972' })).toBe(false);
  });
});

describe('departementMatchingSlug', () => {
  it('should return true when department slug matches', () => {
    const matcher = departementMatchingSlug('paris');

    expect(matcher({ slug: 'paris' })).toBe(true);
  });

  it('should return false when department slug does not match', () => {
    const matcher = departementMatchingSlug('paris');

    expect(matcher({ slug: 'bouches-du-rhone' })).toBe(false);
  });

  it('should return false when slug is undefined', () => {
    const matcher = departementMatchingSlug(undefined);

    expect(matcher({ slug: 'paris' })).toBe(false);
  });
});
