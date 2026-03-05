import { describe, expect, it } from 'vitest';
import { filterDepartementsByTerritoire, filterRegionsByTerritoire } from './filter-by-territoire';

describe('filterDepartementsByTerritoire', () => {
  it('should return all departements when no filter is provided', () => {
    const result = filterDepartementsByTerritoire({});

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((d) => d.code === '75')).toBe(true);
    expect(result.some((d) => d.code === '13')).toBe(true);
  });

  it('should filter departements by departement codes', () => {
    const result = filterDepartementsByTerritoire({
      territoire_type: 'departements',
      territoires: ['75', '13']
    });

    expect(result).toHaveLength(2);
    expect(result.map((d) => d.code)).toEqual(expect.arrayContaining(['75', '13']));
  });

  it('should filter departements by region codes', () => {
    const result = filterDepartementsByTerritoire({
      territoire_type: 'regions',
      territoires: ['11']
    });

    expect(result.every((d) => ['75', '77', '78', '91', '92', '93', '94', '95'].includes(d.code))).toBe(true);
  });

  it('should filter departements by commune INSEE codes', () => {
    const result = filterDepartementsByTerritoire({
      territoire_type: 'communes',
      territoires: ['75056', '13055']
    });

    expect(result).toHaveLength(2);
    expect(result.map((d) => d.code)).toEqual(expect.arrayContaining(['75', '13']));
  });

  it('should handle DOM commune codes', () => {
    const result = filterDepartementsByTerritoire({
      territoire_type: 'communes',
      territoires: ['97105']
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.code).toBe('971');
  });

  it('should return all departements when territoires is empty', () => {
    const result = filterDepartementsByTerritoire({
      territoire_type: 'departements',
      territoires: []
    });

    expect(result.length).toBeGreaterThan(90);
  });
});

describe('filterRegionsByTerritoire', () => {
  it('should return all regions when no filter is provided', () => {
    const result = filterRegionsByTerritoire({});

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((r) => r.code === '11')).toBe(true);
  });

  it('should filter regions by region codes', () => {
    const result = filterRegionsByTerritoire({
      territoire_type: 'regions',
      territoires: ['11', '93']
    });

    expect(result).toHaveLength(2);
    expect(result.map((r) => r.code)).toEqual(expect.arrayContaining(['11', '93']));
  });

  it('should filter regions by departement codes', () => {
    const result = filterRegionsByTerritoire({
      territoire_type: 'departements',
      territoires: ['75']
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.code).toBe('11');
  });

  it('should filter regions by commune INSEE codes', () => {
    const result = filterRegionsByTerritoire({
      territoire_type: 'communes',
      territoires: ['75056']
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.code).toBe('11');
  });

  it('should return all regions when territoires is empty', () => {
    const result = filterRegionsByTerritoire({
      territoire_type: 'regions',
      territoires: []
    });

    expect(result.length).toBeGreaterThan(10);
  });
});
