import { describe, expect, it } from 'vitest';
import { appendCollectivites } from './append-collectivites';

describe('region', () => {
  it('should append departement and region codes to lieu with code insee', () => {
    const lieu = { code_insee: '75101' };

    const withCodes = appendCollectivites(lieu);

    expect(withCodes).toStrictEqual({
      code_insee: '75101',
      departement: 'paris',
      region: 'ile-de-france'
    });
  });

  it('should append departement and region codes to lieu with code insee in outremer', () => {
    const lieu = { code_insee: '97102' };

    const withCodes = appendCollectivites(lieu);

    expect(withCodes).toStrictEqual({
      code_insee: '97102',
      departement: 'guadeloupe',
      region: 'guadeloupe'
    });
  });
});
