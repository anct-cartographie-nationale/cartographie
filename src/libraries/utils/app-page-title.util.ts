import { env } from '@/env';

export const appPageTitle = (...pageTitle: string[]): string =>
  pageTitle.length === 0 ? `${env.NEXT_PUBLIC_APP_NAME}` : [pageTitle.join(' - '), env.NEXT_PUBLIC_APP_NAME].join(' | ');
