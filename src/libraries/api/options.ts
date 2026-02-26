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

type OrFilter = { or?: string };
type AndFilter = { and?: string };

export const buildAndFilter = (...filters: (OrFilter | AndFilter)[]): AndFilter => {
  const orParts = filters.filter((f): f is { or: string } => 'or' in f && f.or !== undefined).map((f) => `or${f.or}`);
  const andParts = filters
    .filter((f): f is { and: string } => 'and' in f && f.and !== undefined)
    .map((f) => f.and.slice(1, -1));

  const allParts = [...orParts, ...andParts];
  return allParts.length > 0 ? { and: `(${allParts.join(',')})` } : {};
};
