import { fail, promise, succeed } from 'effect/Effect';
import { describe, expect, it } from 'vitest';
import { debouncedSuggestions } from './debounced-suggestions';

const echo = (input: string) => succeed([input.toUpperCase()]);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const slowFor = (delays: Record<string, number>) => (input: string) =>
  promise(async () => {
    await wait(delays[input] ?? 0);
    return [input.toUpperCase()];
  });

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

  it('should ignore a slow response that arrives after the latest input has been answered', async () => {
    const load = debouncedSuggestions(slowFor({ sai: 60 }), { minLength: 1, delay: 0 });

    const slow = load('sai');
    await wait(10);
    const fresh = await load('saint');
    const stale = await slow;

    expect(fresh).toStrictEqual({ items: ['SAINT'], isLoading: false });
    expect(stale).toStrictEqual({ items: ['SAINT'], isLoading: false });
  });

  it('should report a stale response as still loading while the latest search is in flight', async () => {
    const load = debouncedSuggestions(slowFor({ sai: 30, saint: 100 }), { minLength: 1, delay: 0 });

    const stale = load('sai');
    await wait(5);
    const fresh = load('saint');

    expect(await stale).toStrictEqual({ items: [], isLoading: true });
    expect(await fresh).toStrictEqual({ items: ['SAINT'], isLoading: false });
  });

  it('should surface a search failure instead of rejecting', async () => {
    const load = debouncedSuggestions(() => fail(new Error('search failed')), { minLength: 1, delay: 0 });

    expect(await load('abc')).toStrictEqual({ items: [], isLoading: false, error: 'search failed' });
  });

  it('should keep separate state per instance', async () => {
    const first = debouncedSuggestions(echo, { minLength: 1, delay: 0 });
    const second = debouncedSuggestions(echo, { minLength: 1, delay: 0 });

    expect(await first('a')).toStrictEqual({ items: ['A'], isLoading: false });
    expect(await second('b')).toStrictEqual({ items: ['B'], isLoading: false });
  });
});
