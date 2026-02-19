import { clientEnv } from '@/env.client';

export const appPageTitle = (...pageTitle: string[]): string =>
  pageTitle.length === 0 ? clientEnv.NEXT_PUBLIC_APP_NAME : [pageTitle.join(' - '), clientEnv.NEXT_PUBLIC_APP_NAME].join(' | ');
