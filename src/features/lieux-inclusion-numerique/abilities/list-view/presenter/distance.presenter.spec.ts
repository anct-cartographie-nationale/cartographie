import { describe, expect, it } from 'vitest';
import { distanceLabel } from './distance.presenter';

describe('distanceLabel', () => {
  it('announces lieux located at the same point', () => {
    expect(distanceLabel('0.00')).toBe('à moins de 10 m');
  });

  it('displays meters under one kilometer', () => {
    expect(distanceLabel('0.03')).toBe('à 30 m');
    expect(distanceLabel('0.99')).toBe('à 990 m');
  });

  it('displays kilometers with a french decimal separator', () => {
    expect(distanceLabel('1.00')).toBe('à 1,0 km');
    expect(distanceLabel('12.34')).toBe('à 12,3 km');
  });
});
