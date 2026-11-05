import { describe, expect, it } from 'vitest';
import { splitHref } from './split-href';

describe('split href', () => {
  it('keeps a path without query', () => {
    expect(splitHref('/bretagne/finistere')).toEqual({ to: '/bretagne/finistere', search: {} });
  });

  it('decodes the query into search values', () => {
    expect(splitHref('/bretagne/finistere?services=Ma%C3%AEtrise+des+outils&page=2')).toEqual({
      to: '/bretagne/finistere',
      search: { services: 'Maîtrise des outils', page: '2' }
    });
  });

  it('keeps a relative path', () => {
    expect(splitHref('bretagne?source=coop')).toEqual({ to: 'bretagne', search: { source: 'coop' } });
  });
});
