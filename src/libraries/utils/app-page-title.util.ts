export const appPageTitle = (...pageTitle: string[]): string =>
  pageTitle.length === 0
    ? `${process.env['NEXT_PUBLIC_APP_NAME']}`
    : [pageTitle.join(' - '), process.env['NEXT_PUBLIC_APP_NAME']].join(' | ');
