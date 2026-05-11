import { tem } from '@pulumiverse/scaleway';
import { config } from '../config';
import { name } from '../utils/name';
import { scalewayProvider } from './scaleway.provider';

const domain = new tem.Domain(
  name('email-domain'),
  {
    name: 'inclusion-numerique.anct.gouv.fr',
    acceptTos: true,
    region: 'fr-par'
  },
  { provider: scalewayProvider }
);

export const EMAIL_SMTP_HOST = domain.smtpHost;
export const EMAIL_SMTP_PORT = domain.smtpPort;
export const EMAIL_DKIM_CONFIG = domain.dkimConfig;
export const EMAIL_SPF_CONFIG = domain.spfValue;
export const EMAIL_DMARC_NAME = domain.dmarcName;
export const EMAIL_DMARC_CONFIG = domain.dmarcConfig;
export const EMAIL_MX_CONFIG = domain.mxConfig;
export const EMAIL_STATUS = domain.status;
