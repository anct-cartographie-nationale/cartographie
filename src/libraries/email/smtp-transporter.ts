import nodemailer, { type Transporter } from 'nodemailer';

export type SmtpConfig = {
  host: string | undefined;
  port: number;
  user: string | undefined;
  pass: string | undefined;
};

export const smtpTransporter = ({ host, port, user, pass }: SmtpConfig): Transporter =>
  nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
