import { describe, expect, it } from 'vitest';
import { getDepartementCodeFromInsee } from './get-departement-code';

describe('getDepartementCodeFromInsee', () => {
  it('should extract department code from metropolitan commune INSEE code', () => {
    expect(getDepartementCodeFromInsee('75056')).toBe('75');
    expect(getDepartementCodeFromInsee('13055')).toBe('13');
    expect(getDepartementCodeFromInsee('69123')).toBe('69');
  });

  it('should extract department code from single digit department', () => {
    expect(getDepartementCodeFromInsee('01053')).toBe('01');
    expect(getDepartementCodeFromInsee('09122')).toBe('09');
  });

  it('should extract 3-digit department code for DOM (97xxx)', () => {
    expect(getDepartementCodeFromInsee('97105')).toBe('971');
    expect(getDepartementCodeFromInsee('97209')).toBe('972');
    expect(getDepartementCodeFromInsee('97302')).toBe('973');
    expect(getDepartementCodeFromInsee('97411')).toBe('974');
    expect(getDepartementCodeFromInsee('97608')).toBe('976');
  });

  it('should handle Corsica departments', () => {
    expect(getDepartementCodeFromInsee('2A004')).toBe('2A');
    expect(getDepartementCodeFromInsee('2B033')).toBe('2B');
  });
});
