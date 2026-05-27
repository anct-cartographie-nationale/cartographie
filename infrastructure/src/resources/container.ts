import { containers, secrets } from '@pulumiverse/scaleway';
import { config } from '../config';
import { name } from '../utils/name';
import { APP_IMAGE_NAME } from './image';
import { scalewayProvider } from './scaleway.provider';

const SMTP_PASSWORD_SECRET_NAME = name('app-smtp-password');

const smtpPassword = secrets
  .getVersionOutput(
    { secretName: SMTP_PASSWORD_SECRET_NAME, revision: 'latest', region: 'fr-par' },
    { provider: scalewayProvider }
  )
  .data.apply((value) => Buffer.from(value, 'base64').toString('utf8'));

const namespace = new containers.Namespace(
  name('container-namespace'),
  {
    name: name('app-container-namespace'),
    description: `${config.projectName} serverless container namespace`,
    tags: config.tags
  },
  { provider: scalewayProvider }
);

const container = new containers.Container(
  name('container'),
  {
    name: name('app-container'),
    description: `${config.projectName} serverless container instance`,
    tags: config.tags,
    namespaceId: namespace.id,
    registryImage: APP_IMAGE_NAME,
    cpuLimit: 2240,
    memoryLimit: 4096,
    minScale: 1,
    maxScale: 5,
    maxConcurrency: 10,
    port: 80,
    protocol: 'http1',
    environmentVariables: {
      HOSTNAME: '0.0.0.0',
      SMTP_HOST: config.email.smtp.host,
      SMTP_PORT: config.email.smtp.port,
      SMTP_USER: config.email.smtp.user,
      CONTACT_EMAIL_TO: config.email.to,
      CONTACT_EMAIL_FROM: config.email.from
    },
    secretEnvironmentVariables: {
      SMTP_PASS: smtpPassword
    },
    healthChecks: [
      {
        https: [{ path: '/api/health' }],
        failureThreshold: 3,
        interval: '10s'
      }
    ]
  },
  { provider: scalewayProvider }
);

export const APP_URL = container.domainName.apply((domain) => `https://${domain}`);
