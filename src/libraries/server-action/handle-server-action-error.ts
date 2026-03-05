import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { isProcessableError, ServerActionError } from './server-action-result';

const statusCodeMessages: Record<number, string> = [400, 401, 403, 404, 409, 410, 422, 429, 500, 502, 503, 504].reduce<
  Record<number, string>
>((acc, code) => {
  acc[code] = `error.${code}`;
  return acc;
}, {});

const DEFAULT_ERROR = 'error.500';

export const handleServerActionError = (
  error: unknown,
  customErrors?: Record<string, string>
): ReturnType<typeof ServerActionError> => {
  if (isRedirectError(error)) throw error;

  if (!isProcessableError(error)) return ServerActionError(DEFAULT_ERROR);

  const customMessage = customErrors?.[error.body.code];
  if (customMessage != null) return ServerActionError(customMessage);

  return ServerActionError(statusCodeMessages[error.statusCode ?? 0] ?? DEFAULT_ERROR);
};

export { isRedirectError };
