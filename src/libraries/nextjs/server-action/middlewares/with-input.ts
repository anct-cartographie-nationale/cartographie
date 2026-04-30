import type { ZodType } from 'zod';
import type { ActionMiddleware } from '../action';
import { serverActionError } from '../server-action-result';

export const withInput = <TInput>(schema: ZodType<TInput>): ActionMiddleware<object, { input: TInput }> => {
  return async (_ctx, rawInput) => {
    const parsed = schema.safeParse(rawInput);
    if (!parsed.success) {
      throw serverActionError('validation_error', 422);
    }
    return { ctx: { input: parsed.data } };
  };
};
