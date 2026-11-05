export const hasNavigatedWithinApp = (documentUrl: string | undefined, currentUrl: string): boolean =>
  documentUrl != null && new URL(documentUrl).pathname !== new URL(currentUrl).pathname;
