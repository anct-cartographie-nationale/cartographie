import { describe, expect, it } from 'vitest';
import { hrefWithSearchParams } from './href-with-search-params';

describe('hrefWithSearchParams', () => {
  it('should return href without params when no searchParams provided', () => {
    expect(hrefWithSearchParams('/page')()).toBe('/page');
  });

  it('should return href without params when searchParams is empty', () => {
    expect(hrefWithSearchParams('/page')(new URLSearchParams())).toBe('/page');
  });

  it('should append search params to href', () => {
    const params = new URLSearchParams({ foo: 'bar' });

    expect(hrefWithSearchParams('/page')(params)).toBe('/page?foo=bar');
  });

  it('should handle multiple search params', () => {
    const params = new URLSearchParams({ foo: 'bar', baz: 'qux' });

    expect(hrefWithSearchParams('/page')(params)).toBe('/page?foo=bar&baz=qux');
  });

  it('should exclude specified params', () => {
    const params = new URLSearchParams({ foo: 'bar', page: '2', baz: 'qux' });

    expect(hrefWithSearchParams('/page')(params, ['page'])).toBe('/page?foo=bar&baz=qux');
  });

  it('should exclude multiple params', () => {
    const params = new URLSearchParams({ foo: 'bar', page: '2', sort: 'asc' });

    expect(hrefWithSearchParams('/page')(params, ['page', 'sort'])).toBe('/page?foo=bar');
  });

  it('should return href without query string when all params excluded', () => {
    const params = new URLSearchParams({ page: '2' });

    expect(hrefWithSearchParams('/page')(params, ['page'])).toBe('/page');
  });

  it('should use empty string as default href', () => {
    const params = new URLSearchParams({ foo: 'bar' });

    expect(hrefWithSearchParams()(params)).toBe('?foo=bar');
  });

  it('should handle special characters in params', () => {
    const params = new URLSearchParams({ query: 'hello world' });

    expect(hrefWithSearchParams('/search')(params)).toBe('/search?query=hello+world');
  });
});
