import type { InjectionKey } from 'piqure/src/Providing';
import type { Provider } from '../apply-providers';
import { ClientBinder } from './client-binder';

export const withClientBinder =
  <TBind, TTo extends TBind>(bind: InjectionKey<TBind>, to: TTo) =>
  async (): Promise<{ ctx: object; provider: Provider }> => ({
    ctx: {},
    provider: {
      component: ClientBinder as Provider['component'],
      props: { bind, to }
    }
  });
