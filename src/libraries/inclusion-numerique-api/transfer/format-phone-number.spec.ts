import { describe, expect, it } from 'vitest';
import { formatPhoneNumber } from './format-phone-number';

describe('formatPhoneNumber', () => {
  it('should convert +33 prefix to 0', () => {
    expect(formatPhoneNumber('+33612345678')).toBe('06 12 34 56 78');
  });

  it('should add spaces between digit pairs', () => {
    expect(formatPhoneNumber('0612345678')).toBe('06 12 34 56 78');
  });

  it('should handle landline numbers', () => {
    expect(formatPhoneNumber('+33145678901')).toBe('01 45 67 89 01');
    expect(formatPhoneNumber('0145678901')).toBe('01 45 67 89 01');
  });

  it('should handle numbers already with spaces', () => {
    expect(formatPhoneNumber('06 12 34 56 78')).toBe('06 12 34 56 78');
  });

  it('should handle numbers with +33 and space', () => {
    expect(formatPhoneNumber('+33 6 12 34 56 78')).toBe('06 12 34 56 78');
  });

  it('should handle short numbers', () => {
    expect(formatPhoneNumber('3615')).toBe('36 15');
  });
});
