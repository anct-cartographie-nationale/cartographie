'use server';

import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { serverEnv } from '@/env.server';
import {
  ServerActionError,
  type ServerActionResult,
  ServerActionSuccess
} from '@/libraries/nextjs/server-action/server-action-result';
import { type ContactFormData, contactFormSchema } from './contact-form.schema';
import { ContactMessageEmail } from './contact-message.email';

export const sendContactMessage = async (data: ContactFormData): Promise<ServerActionResult> => {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    return ServerActionError('Les données du formulaire sont invalides.');
  }

  const transporter = nodemailer.createTransport({
    host: serverEnv.SMTP_HOST,
    port: serverEnv.SMTP_PORT,
    secure: serverEnv.SMTP_PORT === 465,
    auth: {
      user: serverEnv.SMTP_USER,
      pass: serverEnv.SMTP_PASS
    }
  });

  try {
    const html = await render(ContactMessageEmail(parsed.data));

    await transporter.sendMail({
      from: serverEnv.CONTACT_EMAIL_FROM,
      to: serverEnv.CONTACT_EMAIL_TO,
      replyTo: parsed.data.email,
      subject: `[Cartographie] ${parsed.data.typeDemande} - ${parsed.data.prenom} ${parsed.data.nom}`,
      html
    });

    return ServerActionSuccess();
  } catch (error) {
    console.error('[contact] Échec envoi email:', error);
    return ServerActionError("Une erreur est survenue lors de l'envoi du message.");
  }
};
