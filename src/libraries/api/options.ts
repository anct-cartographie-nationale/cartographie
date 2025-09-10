export type PaginateOptions = {
  paginate?: { limit: number; offset: number };
};

export type SelectOptions<TItem> = {
  select?: Array<keyof TItem>;
};

export type FilterOptions<TItem> = {
  filter?: Partial<Record<keyof TItem, unknown> | { or: string }>;
};

const toQueryParam = (urlSerachParams: URLSearchParams, [key, value]: [string, string]): URLSearchParams => {
  if (value != null) urlSerachParams.set(key, value);
  return urlSerachParams;
};

const toQueryArray = (urlSerachParams: URLSearchParams, [key, value]: [string, string[]]) => {
  urlSerachParams.set(key, value.join(','));
  return urlSerachParams;
};

export const toQueryParams = (options: Record<string, object>): string =>
  Object.entries(options)
    .reduce(
      (urlSerachParams: URLSearchParams, [key, value]) =>
        Array.isArray(value)
          ? toQueryArray(urlSerachParams, [key, value])
          : Object.entries(value).reduce(toQueryParam, urlSerachParams),
      new URLSearchParams()
    )
    .toString();
