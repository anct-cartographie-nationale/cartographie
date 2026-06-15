'use server';

import { actionBuilder, ServerActionSuccess, withInput } from '@arckit/nextjs/action';
import { withErrorReporter } from '@/configuration/telemetry/error-reporter/server';
import { contactFormSchema } from '@/features/contact/abilities/send-message/domain/contact-form.schema';
import { sendContactMessage } from '@/features/contact/abilities/send-message/implementations/send-contact-message';

export const sendContactMessageAction = actionBuilder()
  .use(withInput((raw) => contactFormSchema.parse(raw)))
  .use(withErrorReporter('sendContactMessageAction'))
  .execute<void>(async ({ input }) => {
    await sendContactMessage(input);
    return ServerActionSuccess();
  });
