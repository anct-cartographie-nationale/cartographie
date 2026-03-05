import { describe, expect, it } from 'vitest';
import { hasError } from './has-error';

describe('hasError', () => {
  it('should return false when field is valid', () => {
    const field = {
      meta: { isTouched: true, isPristine: true, isBlurred: true, isValid: true }
    };

    expect(hasError(field)).toBe(false);
  });

  it('should return true when field is invalid and touched while pristine', () => {
    const field = {
      meta: { isTouched: true, isPristine: true, isBlurred: false, isValid: false }
    };

    expect(hasError(field)).toBe(true);
  });

  it('should return true when field is invalid and blurred', () => {
    const field = {
      meta: { isTouched: false, isPristine: false, isBlurred: true, isValid: false }
    };

    expect(hasError(field)).toBe(true);
  });

  it('should return false when field is invalid but not touched and not blurred', () => {
    const field = {
      meta: { isTouched: false, isPristine: true, isBlurred: false, isValid: false }
    };

    expect(hasError(field)).toBe(false);
  });

  it('should return false when field is invalid, touched but not pristine and not blurred', () => {
    const field = {
      meta: { isTouched: true, isPristine: false, isBlurred: false, isValid: false }
    };

    expect(hasError(field)).toBe(false);
  });

  it('should return true when field is invalid, touched, pristine, even if not blurred', () => {
    const field = {
      meta: { isTouched: true, isPristine: true, isBlurred: false, isValid: false }
    };

    expect(hasError(field)).toBe(true);
  });
});
