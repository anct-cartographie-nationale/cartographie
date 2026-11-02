import { describe, expect, it } from 'vitest';
import { contrastColor } from './contrast-color';

describe('contrastColor', () => {
  it('should return white on a dark color', () => {
    expect(contrastColor('#000091')).toBe('#ffffff');
    expect(contrastColor('#1e1e1e')).toBe('#ffffff');
  });

  it('should return a dark color on a light color', () => {
    expect(contrastColor('#ffffff')).toBe('#1e1e1e');
    expect(contrastColor('#ffd700')).toBe('#1e1e1e');
  });

  it('should accept short hex notation', () => {
    expect(contrastColor('#fff')).toBe('#1e1e1e');
    expect(contrastColor('#009')).toBe('#ffffff');
  });

  it('should fall back to white when the color is not a hex value', () => {
    expect(contrastColor('rouge')).toBe('#ffffff');
  });
});
