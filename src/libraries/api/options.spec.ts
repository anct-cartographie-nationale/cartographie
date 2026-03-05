import { describe, expect, it } from 'vitest';
import {
  buildAndFilter,
  countFromHeaders,
  type FilterOptions,
  filterUnion,
  type PaginateOptions,
  toQueryParams
} from './options';

describe('options', () => {
  it('should create query params for pagination', () => {
    const options: PaginateOptions = {
      paginate: {
        limit: 10,
        offset: 20
      }
    };

    const queryParams = toQueryParams(options);

    expect(queryParams).toStrictEqual('limit=10&offset=20');
  });

  it('should create query params for filter oprions', () => {
    const options: FilterOptions<{ id: string }> = {
      filter: { id: ['gt.18', 'lt.30'] }
    };

    const queryParams = toQueryParams(options);

    expect(queryParams).toStrictEqual('id=gt.18&id=lt.30');
  });

  it('should create query params for select option', () => {
    const options = {
      select: ['id', 'name']
    };

    const queryParams = toQueryParams(options, { select: ',' });

    expect(queryParams).toStrictEqual('select=id%2Cname');
  });

  it('should create query params for order option', () => {
    const options = {
      order: ['name', 'asc']
    };

    const queryParams = toQueryParams(options, { order: '.' });

    expect(queryParams).toStrictEqual('order=name.asc');
  });
});

describe('buildAndFilter', () => {
  it('should return empty object when all filters are empty', () => {
    const result = buildAndFilter({}, {}, {});

    expect(result).toStrictEqual({});
  });

  it('should return empty object when no filters provided', () => {
    const result = buildAndFilter();

    expect(result).toStrictEqual({});
  });

  it('should combine single filter', () => {
    const result = buildAndFilter({ or: '(code_insee.like.75*)' });

    expect(result).toStrictEqual({ and: '(or(code_insee.like.75*))' });
  });

  it('should combine multiple filters', () => {
    const result = buildAndFilter({ or: '(code_insee.like.75*)' }, { or: '(services.cs.{accompagnement})' });

    expect(result).toStrictEqual({ and: '(or(code_insee.like.75*),or(services.cs.{accompagnement}))' });
  });

  it('should ignore filters without or property', () => {
    const result = buildAndFilter({ or: '(code_insee.like.75*)' }, {}, { or: '(services.cs.{accompagnement})' });

    expect(result).toStrictEqual({ and: '(or(code_insee.like.75*),or(services.cs.{accompagnement}))' });
  });

  it('should accept and combine and filters', () => {
    const result = buildAndFilter({ and: '(or(a),or(b))' });

    expect(result).toStrictEqual({ and: '(or(a),or(b))' });
  });

  it('should combine or and and filters together', () => {
    const regionFilter = { or: '(code_insee.like.75*)' };
    const searchFilters = { and: '(or(services.cs.{a}),or(frais.eq.gratuit))' };

    const result = buildAndFilter(regionFilter, searchFilters);

    expect(result).toStrictEqual({ and: '(or(code_insee.like.75*),or(services.cs.{a}),or(frais.eq.gratuit))' });
  });
});

describe('filterUnion', () => {
  it('should return empty object when values array is empty', () => {
    const template = (v: string) => `field.eq.${v}`;

    expect(filterUnion([])(template)).toEqual({});
  });

  it('should create or filter for single value', () => {
    const template = (v: string) => `field.eq.${v}`;

    expect(filterUnion(['foo'])(template)).toEqual({ or: '(field.eq.foo)' });
  });

  it('should create or filter for multiple values', () => {
    const template = (v: string) => `field.eq.${v}`;

    expect(filterUnion(['foo', 'bar', 'baz'])(template)).toEqual({ or: '(field.eq.foo,field.eq.bar,field.eq.baz)' });
  });

  it('should work with complex filter templates', () => {
    const template = (v: string) => `services.cs.{${v}}`;

    expect(filterUnion(['Aide', 'Formation'])(template)).toEqual({ or: '(services.cs.{Aide},services.cs.{Formation})' });
  });
});

describe('countFromHeaders', () => {
  it('should extract count from content-range header', () => {
    const headers = new Headers({ 'content-range': '0-9/42' });

    expect(countFromHeaders(headers)).toBe(42);
  });

  it('should return 0 when content-range header is missing', () => {
    const headers = new Headers();

    expect(countFromHeaders(headers)).toBe(0);
  });

  it('should return 0 when content-range format is invalid', () => {
    const headers = new Headers({ 'content-range': 'invalid' });

    expect(countFromHeaders(headers)).toBe(0);
  });

  it('should handle large counts', () => {
    const headers = new Headers({ 'content-range': '0-99/123456' });

    expect(countFromHeaders(headers)).toBe(123456);
  });

  it('should handle count of 0', () => {
    const headers = new Headers({ 'content-range': '*/0' });

    expect(countFromHeaders(headers)).toBe(0);
  });
});
