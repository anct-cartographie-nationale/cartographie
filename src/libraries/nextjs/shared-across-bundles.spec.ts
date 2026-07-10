import { describe, expect, it } from 'vitest';
import { sharedAcrossBundles } from './shared-across-bundles';

describe('sharedAcrossBundles', () => {
  it('should build the value once and return the same instance for a given name', () => {
    const first = sharedAcrossBundles('test:same', () => ({ n: 1 }));
    const second = sharedAcrossBundles('test:same', () => ({ n: 2 }));

    expect(second).toBe(first);
    expect(second.n).toBe(1);
  });

  it('should keep distinct values for distinct names', () => {
    const a = sharedAcrossBundles('test:a', () => ({ id: 'a' }));
    const b = sharedAcrossBundles('test:b', () => ({ id: 'b' }));

    expect(a).not.toBe(b);
    expect(a.id).toBe('a');
    expect(b.id).toBe('b');
  });
});
