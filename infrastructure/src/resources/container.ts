import { containers } from '@pulumiverse/scaleway';
import { config } from '../config';
import { env } from '../env';
import { name } from '../utils/name';
import { EMAIL_SMTP_HOST, EMAIL_SMTP_PORT } from './email';
import { APP_IMAGE_NAME } from './image';
import { scalewayProvider } from './scaleway.provider';

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
      SMTP_HOST: EMAIL_SMTP_HOST,
      SMTP_PORT: EMAIL_SMTP_PORT.apply((port) => String(port)),
      SMTP_USER: env.SCW_DEFAULT_PROJECT_ID,
      SMTP_PASS: env.SCW_SECRET_KEY,
      CONTACT_EMAIL_TO: 'carto@inclusion-numerique.anct.gouv.fr',
      CONTACT_EMAIL_FROM: 'ne-pas-repondre@inclusion-numerique.anct.gouv.fr'
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
