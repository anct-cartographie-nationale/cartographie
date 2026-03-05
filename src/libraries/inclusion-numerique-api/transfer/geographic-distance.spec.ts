import { describe, expect, it } from 'vitest';
import { geographicDistance } from './geographic-distance';

describe('geographicDistance', () => {
  it('should return 0 for same coordinates', () => {
    const point = { latitude: 48.8566, longitude: 2.3522 };

    expect(geographicDistance(point, point)).toBe(0);
  });

  it('should calculate distance between Paris and Marseille (~660km)', () => {
    const paris = { latitude: 48.8566, longitude: 2.3522 };
    const marseille = { latitude: 43.2965, longitude: 5.3698 };

    const distance = geographicDistance(paris, marseille);

    expect(distance).toBeGreaterThan(650_000);
    expect(distance).toBeLessThan(680_000);
  });

  it('should calculate distance between Paris and Lyon (~390km)', () => {
    const paris = { latitude: 48.8566, longitude: 2.3522 };
    const lyon = { latitude: 45.764, longitude: 4.8357 };

    const distance = geographicDistance(paris, lyon);

    expect(distance).toBeGreaterThan(380_000);
    expect(distance).toBeLessThan(400_000);
  });

  it('should calculate short distance (~1km)', () => {
    const eiffelTower = { latitude: 48.8584, longitude: 2.2945 };
    const champDeMars = { latitude: 48.8556, longitude: 2.2986 };

    const distance = geographicDistance(eiffelTower, champDeMars);

    expect(distance).toBeGreaterThan(400);
    expect(distance).toBeLessThan(600);
  });

  it('should be symmetric (A to B equals B to A)', () => {
    const paris = { latitude: 48.8566, longitude: 2.3522 };
    const lyon = { latitude: 45.764, longitude: 4.8357 };

    expect(geographicDistance(paris, lyon)).toBeCloseTo(geographicDistance(lyon, paris), 5);
  });

  it('should handle negative longitudes', () => {
    const paris = { latitude: 48.8566, longitude: 2.3522 };
    const newYork = { latitude: 40.7128, longitude: -74.006 };

    const distance = geographicDistance(paris, newYork);

    expect(distance).toBeGreaterThan(5_800_000);
    expect(distance).toBeLessThan(5_900_000);
  });
});
