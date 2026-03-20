type ParamsContext = { params: Record<string, string> };

// Direct extraction: withPathParams('id', 'slug') extracts params.id and params.slug
type WithPathParamsDirectResult<TKeys extends string[]> = (
  ctx: ParamsContext
) => Promise<{ ctx: { [K in TKeys[number]]: string | undefined } }>;

// Mapped extraction: withPathParams({ regionSlug: 'region' }) extracts params.region as regionSlug
type WithPathParamsMappedResult<TMapping extends Record<string, string>> = (
  ctx: ParamsContext
) => Promise<{ ctx: { [K in keyof TMapping]: string | undefined } }>;

export function withPathParams<TKeys extends string[]>(...keys: [...TKeys]): WithPathParamsDirectResult<TKeys>;
export function withPathParams<TMapping extends Record<string, string>>(
  mapping: TMapping
): WithPathParamsMappedResult<TMapping>;
export function withPathParams(...args: string[] | [Record<string, string>]) {
  // Object mapping: { ctxKey: 'paramKey' }
  if (args.length === 1 && typeof args[0] === 'object') {
    const mapping = args[0];
    return async (ctx: ParamsContext) => {
      const extracted = Object.fromEntries(Object.entries(mapping).map(([ctxKey, paramKey]) => [ctxKey, ctx.params[paramKey]]));
      return { ctx: extracted };
    };
  }

  // Direct keys: extract params with same name
  const keys = args as string[];
  return async (ctx: ParamsContext) => {
    const extracted = Object.fromEntries(keys.map((key) => [key, ctx.params[key]]));
    return { ctx: extracted };
  };
}
