'use server';

import { actionBuilder, ServerActionSuccess, withInput } from '@arckit/nextjs/action';
import { contactFormSchema } from '@/features/contact/abilities/send-message/domain/contact-form.schema';
import { sendContactMessage } from '@/features/contact/abilities/send-message/implementations/send-contact-message';

export const sendContactMessageAction = actionBuilder()
  .use(withInput((raw) => contactFormSchema.parse(raw)))
  .execute<void>(async ({ input }) => {
    await sendContactMessage(input);
    return ServerActionSuccess();
  });
