import type { Pipeline } from '../shared/types';
import type { LayoutProps } from './types';

export const fromLayout: Pipeline<object, LayoutProps, 'layout'> = {
  _ctx: {} as object,
  _extra: {} as LayoutProps,
  _finalizer: 'layout',
  middlewares: []
};

export { use } from '../page/builder';
