import { describe, expect, it } from 'vitest';
import { isOpenNow } from './is-open-now';

describe('isOpenNow', () => {
  it('should return true when open during business hours', () => {
    const mondayAt10am = new Date('2025-01-06T10:00:00');
    const horaires = 'Mo-Fr 09:00-18:00';

    expect(isOpenNow(mondayAt10am)(horaires)).toBe(true);
  });

  it('should return false when closed outside business hours', () => {
    const mondayAt20pm = new Date('2025-01-06T20:00:00');
    const horaires = 'Mo-Fr 09:00-18:00';

    expect(isOpenNow(mondayAt20pm)(horaires)).toBe(false);
  });

  it('should return false on weekends for weekday-only hours', () => {
    const saturdayAt10am = new Date('2025-01-04T10:00:00');
    const horaires = 'Mo-Fr 09:00-18:00';

    expect(isOpenNow(saturdayAt10am)(horaires)).toBe(false);
  });

  it('should handle complex opening hours', () => {
    const tuesdayAt11am = new Date('2025-01-07T11:00:00');
    const horaires = 'Mo-Fr 09:00-12:00,14:00-18:00';

    expect(isOpenNow(tuesdayAt11am)(horaires)).toBe(true);
  });

  it('should return false during lunch break', () => {
    const tuesdayAt13pm = new Date('2025-01-07T13:00:00');
    const horaires = 'Mo-Fr 09:00-12:00,14:00-18:00';

    expect(isOpenNow(tuesdayAt13pm)(horaires)).toBe(false);
  });

  it('should return false for invalid opening hours format', () => {
    const date = new Date('2025-01-06T10:00:00');

    expect(isOpenNow(date)('invalid format')).toBe(false);
  });

  it('should return false for empty string', () => {
    const date = new Date('2025-01-06T10:00:00');

    expect(isOpenNow(date)('')).toBe(false);
  });

  it('should handle 24/7 opening hours', () => {
    const anyTime = new Date('2025-01-05T03:00:00');

    expect(isOpenNow(anyTime)('24/7')).toBe(true);
  });
});
