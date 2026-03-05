export type ServerActionSuccess<T> = { success: true; data: T };
export type ServerActionError = { success: false; error: string };
export type ServerActionResult<T = void> = ServerActionSuccess<T> | ServerActionError;

export const ServerActionError = (error: string): ServerActionError => ({
  success: false,
  error
});

export const ServerActionSuccess = <T>(data?: T): ServerActionSuccess<T> => ({
  success: true,
  data: (data ?? void 0) as T
});

export type ProcessableError = Error & {
  statusCode: number;
  body: {
    code: string;
    message: string;
  };
};

export const serverActionError = (code: string, statusCode = 400): ProcessableError =>
  Object.assign(new Error(code), {
    statusCode,
    body: { code, message: code }
  });

export const isProcessableError = (error: unknown): error is ProcessableError =>
  error instanceof Error &&
  typeof (error as Partial<ProcessableError>).statusCode === 'number' &&
  typeof (error as Partial<ProcessableError>).body === 'object' &&
  typeof (error as Partial<ProcessableError>).body?.code === 'string' &&
  typeof (error as Partial<ProcessableError>).body?.message === 'string';
