export type PaginateOptions = {
  paginate?: { limit: number; offset: number };
};

export type SelectOptions<TItem> = {
  select?: Array<keyof TItem>;
};

type JsonChildKeys<T> = {
  [K in keyof T & string]: T[K] extends object
    ? {
        [C in keyof T[K] & string]: `${K}->>${C}` | `${K}->${C}`;
      }[keyof T[K] & string]
    : never;
}[keyof T & string];
export type FilterOptions<TItem> = {
  filter?: Partial<Record<keyof TItem | JsonChildKeys<TItem>, unknown>> & ({ or: string } | { and: string } | object);
};

export type OrderOptions<TItem> = {
  order?: [keyof TItem, 'desc' | 'asc'];
};

const toQueryParam = (urlSerachParams: URLSearchParams, [key, value]: [string, string | string[]]): URLSearchParams => {
  if (value == null) return urlSerachParams;

  const values = Array.isArray(value) ? value : [value];
  values.map((v) => urlSerachParams.append(key, v));

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

export const filterUnion = (values: string[]) => (filterTemplate: (value: string) => string) =>
  values.length > 0 ? { or: `(${values.map(filterTemplate).join(',')})` } : {};

export const asCount = <T extends PaginateOptions>(options: T): [T, Headers] => [
  { ...options, paginate: { limit: 0, offset: 0 } },
  new Headers({ Prefer: 'count=exact' })
];

export const countFromHeaders = (headers: Headers): number => {
  const match = headers.get('content-range')?.match(/\/(\d+)$/);
  return match?.[1] == null ? 0 : parseInt(match[1], 10);
};

export const combineOrFilters = (...orFilters: { or?: string }[]): string => {
  return `(or${orFilters
    .map((filter) => filter.or)
    .filter((orFilter): orFilter is string => orFilter !== undefined)
    .join(',or')})`;
};

export const buildAndFilter = (...orFilters: { or?: string }[]): { and?: string } => {
  const definedFilters = orFilters.filter((f): f is { or: string } => f.or !== undefined);
  return definedFilters.length > 0 ? { and: combineOrFilters(...definedFilters) } : {};
};
