export const INTEGRATION_MODE_PARAM = 'integration';

export const IFRAME_MODE = 'iframe';

export const isIframeMode = (searchParams: Record<string, string | undefined>): boolean =>
  searchParams[INTEGRATION_MODE_PARAM] === IFRAME_MODE;

export const withIframeMode = (url: string): string =>
  `${url}${url.includes('?') ? '&' : '?'}${INTEGRATION_MODE_PARAM}=${IFRAME_MODE}`;
