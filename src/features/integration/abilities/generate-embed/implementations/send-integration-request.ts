import { render } from 'react-email';
import { serverEnv } from '@/env.server';
import { type IntegrationRequest, integrationRequestSubject } from '@/features/integration/domain';
import { smtpTransporter } from '@/libraries/email';
import { IntegrationRequestEmail } from './integration-request.email';

export const sendIntegrationRequest = async (request: IntegrationRequest): Promise<void> => {
  const transporter = smtpTransporter({
    host: serverEnv.SMTP_HOST,
    port: serverEnv.SMTP_PORT,
    user: serverEnv.SMTP_USER,
    pass: serverEnv.SMTP_PASS
  });

  const html = await render(IntegrationRequestEmail(request));

  await transporter.sendMail({
    from: serverEnv.CONTACT_EMAIL_FROM,
    to: serverEnv.CONTACT_EMAIL_TO,
    replyTo: request.email,
    subject: integrationRequestSubject(request),
    html
  });
};
