import { describe, expect, it } from 'vitest';
import { nearestLieux } from './nearest-lieux';

const LANDERNEAU = { latitude: 48.450798, longitude: -4.257626 };

const brest = { id: 'brest', latitude: 48.3904, longitude: -4.4861 };
const quimper = { id: 'quimper', latitude: 47.9975, longitude: -4.0979 };
const paris = { id: 'paris', latitude: 48.8566, longitude: 2.3522 };

describe('nearestLieux', () => {
  it('sorts lieux from the nearest to the farthest', () => {
    expect(nearestLieux(LANDERNEAU, 10)([paris, quimper, brest]).map(({ id }) => id)).toEqual(['brest', 'quimper', 'paris']);
  });

  it('keeps only the given number of lieux', () => {
    expect(nearestLieux(LANDERNEAU, 2)([paris, quimper, brest]).map(({ id }) => id)).toEqual(['brest', 'quimper']);
  });

  it('ignores lieux without coordinates', () => {
    const lieux = [
      { id: 'sans-latitude', longitude: -4 },
      { id: 'sans-longitude', latitude: 48 },
      { id: 'sans-coordonnees' },
      brest
    ];

    expect(nearestLieux(LANDERNEAU, 10)(lieux).map(({ id }) => id)).toEqual(['brest']);
  });

  it('keeps lieux located on the same point in their original order', () => {
    const lieux = [
      { id: 'a', ...LANDERNEAU },
      { id: 'b', ...LANDERNEAU },
      { id: 'c', ...LANDERNEAU }
    ];

    expect(nearestLieux(LANDERNEAU, 10)(lieux).map(({ id }) => id)).toEqual(['a', 'b', 'c']);
  });

  it('keeps a lieu located on the equator or the prime meridian', () => {
    const lieu = { id: 'zero', latitude: 0, longitude: 0 };

    expect(nearestLieux(LANDERNEAU, 10)([lieu])).toEqual([lieu]);
  });

  it('does not alter the given lieux', () => {
    const lieux = [paris, brest];

    nearestLieux(LANDERNEAU, 1)(lieux);

    expect(lieux).toEqual([paris, brest]);
  });
});
