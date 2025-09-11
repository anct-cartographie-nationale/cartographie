import { describe, expect, it } from 'vitest';
import { addNombreLieux } from './add-nombre-lieux';

describe('add nombre lieux', (): void => {
  it('computes from each regions nombre lieux', () => {
    const regionRouteResponse = [
      { code: '01', nom: 'Région 1', nombre_lieux: 5 },
      { code: '02', nom: 'Région 2', nombre_lieux: 10 },
      { code: '03', nom: 'Région 3', nombre_lieux: 15 }
    ];

    const regions = [
      { code: '01', departements: ['01', '02'] },
      { code: '02', departements: ['03', '04'] },
      { code: '03', departements: ['05', '06'] }
    ];

    const withNombreLieux = addNombreLieux(regionRouteResponse)(regions);

    expect(withNombreLieux).toStrictEqual([
      { code: '01', departements: ['01', '02'], nombreLieux: 5 },
      { code: '02', departements: ['03', '04'], nombreLieux: 10 },
      { code: '03', departements: ['05', '06'], nombreLieux: 15 }
    ]);
  });
});
