import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { serverEnv } from '@/env.server';
import type { ContactFormData } from '../domain/contact-form.schema';
import type { SendContactMessage } from '../domain/send-contact-message';
import { ContactMessageEmail } from './contact-message.email';

export const sendContactMessage: SendContactMessage = async (data: ContactFormData): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: serverEnv.SMTP_HOST,
    port: serverEnv.SMTP_PORT,
    secure: serverEnv.SMTP_PORT === 465,
    auth: {
      user: serverEnv.SMTP_USER,
      pass: serverEnv.SMTP_PASS
    }
  });

  const html = await render(ContactMessageEmail(data));

  await transporter.sendMail({
    from: serverEnv.CONTACT_EMAIL_FROM,
    to: serverEnv.CONTACT_EMAIL_TO,
    replyTo: data.email,
    subject: `[Cartographie] ${data.typeDemande} — ${data.prenom} ${data.nom}`,
    html
  });
};
