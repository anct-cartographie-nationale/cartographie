import { describe, expect, it } from 'vitest';
import { type FilterOptions, type PaginateOptions, toQueryParams } from './options';

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
