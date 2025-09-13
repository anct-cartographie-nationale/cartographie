export type PaginateOptions = {
  paginate?: { limit: number; offset: number };
};

export type SelectOptions<TItem> = {
  select?: Array<keyof TItem>;
};

export type FilterOptions<TItem> = {
  filter?: Partial<Record<keyof TItem, unknown> | { or: string }>;
};

export type OrderOptions<TItem> = {
  order?: [keyof TItem, 'desc' | 'asc'];
};

const toQueryParam = (urlSerachParams: URLSearchParams, [key, value]: [string, string]): URLSearchParams => {
  if (value != null) urlSerachParams.set(key, value);
  return urlSerachParams;
};

const toQueryArray = <T extends Record<string, object>>(
  urlSerachParams: URLSearchParams,
  [key, value]: [string, string[]],
  separators?: { [K in keyof T]?: string }
) => {
  urlSerachParams.set(key, value.join(separators?.[key] ?? ','));
  return urlSerachParams;
};

export const toQueryParams = <T extends Record<string, object>>(options: T, separators?: { [K in keyof T]?: string }): string =>
  Object.entries(options)
    .reduce(
      (urlSerachParams: URLSearchParams, [key, value]) =>
        Array.isArray(value)
          ? toQueryArray(urlSerachParams, [key, value], separators)
          : Object.entries(value).reduce(toQueryParam, urlSerachParams),
      new URLSearchParams()
    )
    .toString();
