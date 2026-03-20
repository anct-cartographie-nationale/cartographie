type ErrorMapping = { [statusCode: number]: string };

type ResponseError = Error & { response: Response };

const isResponseError = (error: unknown): error is ResponseError =>
  error instanceof Error && 'response' in error && error.response instanceof Response;

export const withErrorHandler =
  (errorMapping: ErrorMapping, defaultMessage: string) =>
  <TCtx extends object>(handler: (ctx: TCtx) => Promise<Response>) =>
  async (ctx: TCtx): Promise<Response> => {
    try {
      return await handler(ctx);
    } catch (error) {
      if (isResponseError(error)) {
        const message = errorMapping[error.response.status] ?? defaultMessage;
        return new Response(message, { status: error.response.status });
      }
      return new Response(defaultMessage, { status: 500 });
    }
  };
