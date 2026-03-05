import { provide } from '@/libraries/injection';
import { URL_SEARCH_PARAMS } from '@/libraries/next';
import type { PageProps } from '../page';

export const withUrlSearchParams =
  () =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { urlSearchParams: URLSearchParams } }> => {
    const searchParams = await props.searchParams;
    const urlSearchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          urlSearchParams.append(key, v);
        }
      } else if (value !== undefined) {
        urlSearchParams.set(key, value);
      }
    }

    provide(URL_SEARCH_PARAMS, urlSearchParams);

    return { ctx: { urlSearchParams } };
  };
