import type { PageProps } from '../page';

export const withSearchParams =
  <TSearchParams extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>>() =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { searchParams: TSearchParams } }> => {
    const searchParams = await props.searchParams;
    return { ctx: { searchParams: searchParams as TSearchParams } };
  };
