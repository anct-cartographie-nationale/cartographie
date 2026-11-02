import { succeed } from 'effect/Effect';
import { describe, expect, it } from 'vitest';
import { debouncedSuggestions } from './debounced-suggestions';

const echo = (input: string) => succeed([input.toUpperCase()]);

describe('debouncedSuggestions', () => {
  it('should return no items without searching when the input is shorter than the minimum length', async () => {
    const load = debouncedSuggestions(echo, { minLength: 3, delay: 0 });

    expect(await load('ab')).toStrictEqual({ items: [], isLoading: false });
  });

  it('should search when the input reaches the minimum length', async () => {
    const load = debouncedSuggestions(echo, { minLength: 3, delay: 0 });

    expect(await load('abc')).toStrictEqual({ items: ['ABC'], isLoading: false });
  });

  it('should only search for the latest input and keep previous items for the stale one', async () => {
    const load = debouncedSuggestions(echo, { minLength: 1, delay: 20 });

    const [first, second] = await Promise.all([load('bre'), load('brest')]);

    expect(first).toStrictEqual({ items: [], isLoading: true });
    expect(second).toStrictEqual({ items: ['BREST'], isLoading: false });
  });

  it('should keep separate state per instance', async () => {
    const first = debouncedSuggestions(echo, { minLength: 1, delay: 0 });
    const second = debouncedSuggestions(echo, { minLength: 1, delay: 0 });

    expect(await first('a')).toStrictEqual({ items: ['A'], isLoading: false });
    expect(await second('b')).toStrictEqual({ items: ['B'], isLoading: false });
  });
});
