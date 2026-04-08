import { describe, expect, it } from 'vitest';
import { aggregateByDepartement } from './aggregate-by-departement';

describe('aggregateByDepartement', () => {
  it('should count code_insee by department for metropolitan France', () => {
    const result = aggregateByDepartement(['75001', '75002', '75003', '69001', '69002']);

    expect(result.get('75')).toBe(3);
    expect(result.get('69')).toBe(2);
  });

  it('should handle DOM-TOM 3-digit codes correctly', () => {
    const result = aggregateByDepartement(['97105', '97106', '97209', '97302', '97411', '97608']);

    expect(result.get('971')).toBe(2); // Guadeloupe
    expect(result.get('972')).toBe(1); // Martinique
    expect(result.get('973')).toBe(1); // Guyane
    expect(result.get('974')).toBe(1); // Réunion
    expect(result.get('976')).toBe(1); // Mayotte
  });

  it('should return empty map for empty input', () => {
    expect(aggregateByDepartement([]).size).toBe(0);
  });
});
