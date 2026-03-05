import { describe, expect, it } from 'vitest';
import { totalLieux } from './total-lieux';

describe('total count', (): void => {
  it('computes from each regions nombre lieux', () => {
    const regionRouteResponse = [
      { code: '01', nom: 'Région 1', nombre_lieux: 5 },
      { code: '02', nom: 'Région 2', nombre_lieux: 10 },
      { code: '03', nom: 'Région 3', nombre_lieux: 15 }
    ];

    const count = totalLieux(regionRouteResponse);

    expect(count).toBe(30);
  });
});
