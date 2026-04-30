'use server';

import { contactFormSchema } from '@/features/contact/abilities/send-message/domain/contact-form.schema';
import { sendContactMessage } from '@/features/contact/abilities/send-message/implementations/send-contact-message';
import { serverAction } from '@/libraries/nextjs/server-action';
import { withInput } from '@/libraries/nextjs/server-action/middlewares/with-input';
import { ServerActionSuccess } from '@/libraries/nextjs/server-action/server-action-result';

export const sendContactMessageAction = serverAction
  .with(withInput(contactFormSchema))
  .mutation<void>(async ({ ctx: { input } }) => {
    await sendContactMessage(input);
    return ServerActionSuccess();
  });
