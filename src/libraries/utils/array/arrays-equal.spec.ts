import { describe, expect, it } from 'vitest';
import { arraysEqual } from './arrays-equal';

describe('arraysEqual', () => {
  it('should return true for identical arrays', () => {
    expect(arraysEqual(['a', 'b', 'c'])(['a', 'b', 'c'])).toBe(true);
  });

  it('should return true for empty arrays', () => {
    expect(arraysEqual([])([])).toBe(true);
  });

  it('should return false for arrays with different lengths', () => {
    expect(arraysEqual(['a', 'b'])(['a', 'b', 'c'])).toBe(false);
  });

  it('should return false for arrays with different values', () => {
    expect(arraysEqual(['a', 'b', 'c'])(['a', 'b', 'd'])).toBe(false);
  });

  it('should return false for arrays with same values in different order', () => {
    expect(arraysEqual(['a', 'b', 'c'])(['c', 'b', 'a'])).toBe(false);
  });

  it('should return true for single element arrays', () => {
    expect(arraysEqual(['a'])(['a'])).toBe(true);
  });

  it('should handle arrays with special characters', () => {
    expect(arraysEqual(['hello world', 'foo-bar'])(['hello world', 'foo-bar'])).toBe(true);
  });
});
