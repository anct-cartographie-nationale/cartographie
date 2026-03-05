import { describe, expect, it } from 'vitest';
import { applyTerritoireFilter } from './apply-territoire-filter';

describe('applyTerritoireFilter', () => {
  it('should return empty object when no filter is provided', () => {
    expect(applyTerritoireFilter({})).toEqual({});
  });

  it('should return empty object when territoire_type is undefined', () => {
    expect(applyTerritoireFilter({ territoires: ['75'] })).toEqual({});
  });

  it('should return empty object when territoires is empty', () => {
    expect(applyTerritoireFilter({ territoire_type: 'departements', territoires: [] })).toEqual({});
  });

  it('should filter by departement codes using code_insee prefix', () => {
    const result = applyTerritoireFilter({
      territoire_type: 'departements',
      territoires: ['75']
    });

    expect(result).toEqual({
      or: '(adresse->>code_insee.like.75*)'
    });
  });

  it('should filter by multiple departement codes', () => {
    const result = applyTerritoireFilter({
      territoire_type: 'departements',
      territoires: ['75', '13']
    });

    expect(result).toEqual({
      or: '(adresse->>code_insee.like.75*,adresse->>code_insee.like.13*)'
    });
  });

  it('should filter by commune codes using exact match', () => {
    const result = applyTerritoireFilter({
      territoire_type: 'communes',
      territoires: ['75056']
    });

    expect(result).toEqual({
      or: '(adresse->>code_insee.eq.75056)'
    });
  });

  it('should filter by region codes expanding to departements', () => {
    const result = applyTerritoireFilter({
      territoire_type: 'regions',
      territoires: ['11']
    });

    expect(result.or).toContain('adresse->>code_insee.like.75*');
    expect(result.or).toContain('adresse->>code_insee.like.77*');
    expect(result.or).toContain('adresse->>code_insee.like.78*');
  });
});
