import { describe, expect, it } from 'vitest';
import { buildAndFilter, type FilterOptions, type PaginateOptions, toQueryParams } from './options';

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

    expect(result).toStrictEqual({ and: '((or(a),or(b)))' });
  });

  it('should combine or and and filters together', () => {
    const regionFilter = { or: '(code_insee.like.75*)' };
    const searchFilters = { and: '(or(services.cs.{a}),or(frais.eq.gratuit))' };

    const result = buildAndFilter(regionFilter, searchFilters);

    expect(result).toStrictEqual({ and: '(or(code_insee.like.75*),(or(services.cs.{a}),or(frais.eq.gratuit)))' });
  });
});
